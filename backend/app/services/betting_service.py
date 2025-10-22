from typing import List, Dict, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime
from app.core.database import get_supabase
from app.models.bet import BetCreate, BetUpdate, BetInDB, BetStatus, BetType, BetSummary
from app.services.token_service import TokenService
from app.services.odds_service import OddsService
import logging

logger = logging.getLogger(__name__)

class BettingService:
    def __init__(self):
        self.supabase = get_supabase()
        self.token_service = TokenService()
        self.odds_service = OddsService()
    
    def place_bet(self, bet_data: BetCreate) -> Optional[BetInDB]:
        """Place a new bet"""
        try:
            # Check if team has sufficient tokens
            current_balance = self.token_service.get_balance(bet_data.team_id, bet_data.week)
            if not current_balance:
                logger.error(f"No token balance found for team {bet_data.team_id} in week {bet_data.week}")
                return None
            
            if current_balance.current_balance < bet_data.bet_amount:
                logger.error(f"Insufficient tokens for team {bet_data.team_id}. Current: {current_balance.current_balance}, Required: {bet_data.bet_amount}")
                return None
            
            # Calculate potential payout
            potential_payout = self._calculate_payout(bet_data.bet_amount, bet_data.odds)
            
            # Create bet record
            bet_record = {
                "id": str(uuid4()),
                "team_id": str(bet_data.team_id),
                "week": bet_data.week,
                "bet_type": bet_data.bet_type.value,
                "bet_amount": bet_data.bet_amount,
                "odds": bet_data.odds,
                "matchup_id": bet_data.matchup_id,
                "bet_selection": bet_data.bet_selection,
                "bet_value": bet_data.bet_value,
                "description": bet_data.description,
                "potential_payout": potential_payout,
                "status": BetStatus.PENDING.value,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            # Insert bet into database
            response = self.supabase.table("bets").insert(bet_record).execute()
            
            if response.data:
                # Deduct tokens from team balance
                success = self.token_service.deduct_tokens(
                    bet_data.team_id, 
                    bet_data.bet_amount, 
                    bet_data.week, 
                    f"Bet placed: {bet_data.bet_type.value} on {bet_data.bet_selection}"
                )
                
                if success:
                    return BetInDB(**response.data[0])
                else:
                    # Rollback bet if token deduction fails
                    self.supabase.table("bets").delete().eq("id", bet_record["id"]).execute()
                    logger.error("Failed to deduct tokens, bet rolled back")
                    return None
            else:
                logger.error("Failed to create bet record")
                return None
                
        except Exception as e:
            logger.error(f"Error placing bet: {e}")
            return None
    
    def get_team_bets(self, team_id: UUID, week: Optional[int] = None, limit: int = 50) -> List[BetInDB]:
        """Get bets for a team"""
        try:
            query = self.supabase.table("bets").select("*").eq("team_id", str(team_id))
            
            if week:
                query = query.eq("week", week)
            
            response = query.order("created_at", desc=True).limit(limit).execute()
            
            return [BetInDB(**bet) for bet in response.data]
            
        except Exception as e:
            logger.error(f"Error getting team bets: {e}")
            return []
    
    def get_bet(self, bet_id: UUID) -> Optional[BetInDB]:
        """Get a specific bet by ID"""
        try:
            response = self.supabase.table("bets").select("*").eq("id", str(bet_id)).execute()
            
            if response.data:
                return BetInDB(**response.data[0])
            return None
            
        except Exception as e:
            logger.error(f"Error getting bet {bet_id}: {e}")
            return None
    
    def update_bet(self, bet_id: UUID, bet_update: BetUpdate) -> Optional[BetInDB]:
        """Update a bet (typically to resolve it)"""
        try:
            update_data = {
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if bet_update.status:
                update_data["status"] = bet_update.status.value
            if bet_update.actual_result:
                update_data["actual_result"] = bet_update.actual_result
            if bet_update.payout:
                update_data["payout"] = bet_update.payout
            if bet_update.notes:
                update_data["notes"] = bet_update.notes
            
            response = self.supabase.table("bets").update(update_data).eq("id", str(bet_id)).execute()
            
            if response.data:
                return BetInDB(**response.data[0])
            return None
            
        except Exception as e:
            logger.error(f"Error updating bet {bet_id}: {e}")
            return None
    
    def resolve_bet(self, bet_id: UUID, actual_result: str, payout: Optional[int] = None) -> Optional[BetInDB]:
        """Resolve a bet with the actual result"""
        try:
            bet = self.get_bet(bet_id)
            if not bet:
                return None
            
            # Determine bet status based on result
            status = self._determine_bet_status(bet, actual_result)
            
            # Calculate payout if not provided
            if payout is None:
                payout = self._calculate_actual_payout(bet, status)
            
            # Update bet
            bet_update = BetUpdate(
                status=status,
                actual_result=actual_result,
                payout=payout
            )
            
            updated_bet = self.update_bet(bet_id, bet_update)
            
            # Add tokens back if bet won
            if status == BetStatus.WON and payout > 0:
                self.token_service.add_tokens(
                    bet.team_id,
                    payout,
                    bet.week,
                    f"Bet won: {bet.bet_type.value} on {bet.bet_selection}"
                )
            
            return updated_bet
            
        except Exception as e:
            logger.error(f"Error resolving bet {bet_id}: {e}")
            return None
    
    def get_betting_summary(self, team_id: UUID, week: Optional[int] = None) -> Optional[BetSummary]:
        """Get betting summary for a team"""
        try:
            bets = self.get_team_bets(team_id, week, limit=1000)
            
            if not bets:
                return BetSummary(
                    team_id=team_id,
                    week=week or 0,
                    total_bets=0,
                    total_wagered=0,
                    total_won=0,
                    total_lost=0,
                    net_profit=0,
                    win_rate=0.0,
                    active_bets=0,
                    pending_amount=0
                )
            
            total_bets = len(bets)
            total_wagered = sum(bet.bet_amount for bet in bets)
            total_won = sum(bet.payout or 0 for bet in bets if bet.status == BetStatus.WON)
            total_lost = sum(bet.bet_amount for bet in bets if bet.status == BetStatus.LOST)
            active_bets = len([bet for bet in bets if bet.status == BetStatus.PENDING])
            pending_amount = sum(bet.bet_amount for bet in bets if bet.status == BetStatus.PENDING)
            
            net_profit = total_won - total_lost
            win_rate = len([bet for bet in bets if bet.status == BetStatus.WON]) / max(total_bets, 1)
            
            return BetSummary(
                team_id=team_id,
                week=week or 0,
                total_bets=total_bets,
                total_wagered=total_wagered,
                total_won=total_won,
                total_lost=total_lost,
                net_profit=net_profit,
                win_rate=win_rate,
                active_bets=active_bets,
                pending_amount=pending_amount
            )
            
        except Exception as e:
            logger.error(f"Error getting betting summary: {e}")
            return None
    
    def _calculate_payout(self, bet_amount: int, odds: int) -> int:
        """Calculate potential payout based on bet amount and odds"""
        if odds > 0:
            # Positive odds (underdog)
            return bet_amount + int((bet_amount * odds) / 100)
        else:
            # Negative odds (favorite)
            return bet_amount + int((bet_amount * 100) / abs(odds))
    
    def _determine_bet_status(self, bet: BetInDB, actual_result: str) -> BetStatus:
        """Determine bet status based on actual result"""
        # This is a simplified implementation
        # In a real system, you'd need to parse the actual result and compare with bet selection
        
        if actual_result.lower() == "push":
            return BetStatus.PUSH
        elif actual_result.lower() == bet.bet_selection.lower():
            return BetStatus.WON
        else:
            return BetStatus.LOST
    
    def _calculate_actual_payout(self, bet: BetInDB, status: BetStatus) -> int:
        """Calculate actual payout based on bet status"""
        if status == BetStatus.WON:
            return self._calculate_payout(bet.bet_amount, bet.odds)
        elif status == BetStatus.PUSH:
            return bet.bet_amount  # Return original bet amount
        else:
            return 0  # Lost bet, no payout
