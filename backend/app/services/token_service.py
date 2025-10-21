from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.core.database import get_supabase
from app.models.token import TokenBalance, TokenBalanceCreate, TokenTransaction, TokenTransactionCreate

class TokenService:
    def __init__(self):
        self.supabase = get_supabase()
    
    async def get_balance(self, team_id: UUID, week: int) -> Optional[TokenBalance]:
        """Get current token balance for a team in a specific week"""
        try:
            response = self.supabase.table("token_balances").select("*").eq("team_id", str(team_id)).eq("week", week).execute()
            
            if response.data:
                return TokenBalance(**response.data[0])
            return None
        except Exception as e:
            print(f"Error getting token balance: {e}")
            return None
    
    async def allocate_weekly_tokens(self, team_id: UUID, week: int) -> Optional[TokenBalance]:
        """Allocate 1000 tokens for a team for a specific week"""
        try:
            # Check if tokens already allocated for this week
            existing_balance = await self.get_balance(team_id, week)
            if existing_balance:
                return existing_balance
            
            # Create new token balance
            token_balance_data = {
                "team_id": str(team_id),
                "week": week,
                "starting_balance": 1000,
                "current_balance": 1000,
                "weekly_used": 0
            }
            
            response = self.supabase.table("token_balances").insert(token_balance_data).execute()
            
            if response.data:
                # Create transaction record
                await self.create_transaction(
                    team_id=team_id,
                    week=week,
                    amount=1000,
                    transaction_type="allocation",
                    description=f"Weekly token allocation for week {week}"
                )
                
                return TokenBalance(**response.data[0])
            return None
        except Exception as e:
            print(f"Error allocating weekly tokens: {e}")
            return None
    
    async def deduct_tokens(self, team_id: UUID, amount: int, week: int, description: str = "Token deduction") -> bool:
        """Deduct tokens from team balance"""
        try:
            # Get current balance
            current_balance = await self.get_balance(team_id, week)
            if not current_balance:
                return False
            
            if current_balance.current_balance < amount:
                return False  # Insufficient balance
            
            # Update balance
            new_balance = current_balance.current_balance - amount
            new_weekly_used = current_balance.weekly_used + amount
            
            response = self.supabase.table("token_balances").update({
                "current_balance": new_balance,
                "weekly_used": new_weekly_used,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", str(current_balance.id)).execute()
            
            if response.data:
                # Create transaction record
                await self.create_transaction(
                    team_id=team_id,
                    week=week,
                    amount=-amount,  # Negative amount for deduction
                    transaction_type="bet",
                    description=description
                )
                return True
            return False
        except Exception as e:
            print(f"Error deducting tokens: {e}")
            return False
    
    async def add_tokens(self, team_id: UUID, amount: int, week: int, description: str = "Token addition") -> bool:
        """Add tokens to team balance"""
        try:
            # Get current balance
            current_balance = await self.get_balance(team_id, week)
            if not current_balance:
                return False
            
            # Update balance
            new_balance = current_balance.current_balance + amount
            
            response = self.supabase.table("token_balances").update({
                "current_balance": new_balance,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", str(current_balance.id)).execute()
            
            if response.data:
                # Create transaction record
                await self.create_transaction(
                    team_id=team_id,
                    week=week,
                    amount=amount,
                    transaction_type="win",
                    description=description
                )
                return True
            return False
        except Exception as e:
            print(f"Error adding tokens: {e}")
            return False
    
    async def create_transaction(self, team_id: UUID, week: int, amount: int, transaction_type: str, description: str) -> Optional[TokenTransaction]:
        """Create a token transaction record"""
        try:
            transaction_data = {
                "team_id": str(team_id),
                "week": week,
                "amount": amount,
                "transaction_type": transaction_type,
                "description": description
            }
            
            response = self.supabase.table("token_transactions").insert(transaction_data).execute()
            
            if response.data:
                return TokenTransaction(**response.data[0])
            return None
        except Exception as e:
            print(f"Error creating transaction: {e}")
            return None
    
    async def get_transaction_history(self, team_id: UUID, week: Optional[int] = None) -> List[TokenTransaction]:
        """Get transaction history for a team"""
        try:
            query = self.supabase.table("token_transactions").select("*").eq("team_id", str(team_id))
            
            if week is not None:
                query = query.eq("week", week)
            
            response = query.order("created_at", desc=True).execute()
            
            return [TokenTransaction(**transaction) for transaction in response.data]
        except Exception as e:
            print(f"Error getting transaction history: {e}")
            return []
    
    async def weekly_token_reset(self, week: int) -> bool:
        """Reset tokens for all teams for a new week"""
        try:
            # This would typically be called by a scheduler
            # For now, we'll just return True as the allocation happens on-demand
            return True
        except Exception as e:
            print(f"Error in weekly token reset: {e}")
            return False
