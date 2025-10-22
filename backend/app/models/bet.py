from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID
from enum import Enum

class BetType(str, Enum):
    MONEYLINE = "moneyline"
    SPREAD = "spread"
    TOTAL = "total"
    CUSTOM = "custom"

class BetStatus(str, Enum):
    PENDING = "pending"
    WON = "won"
    LOST = "lost"
    PUSH = "push"
    CANCELLED = "cancelled"

class BetBase(BaseModel):
    team_id: UUID
    week: int
    bet_type: BetType
    bet_amount: int  # Token amount
    odds: int  # Moneyline odds (e.g., -110, +150)
    
    # Bet details
    matchup_id: str  # Format: "home_team_id-away_team_id-week"
    bet_selection: str  # "home", "away", "over", "under", etc.
    bet_value: Optional[float] = None  # For spreads and totals
    
    # Metadata
    description: Optional[str] = None
    potential_payout: Optional[int] = None

class BetCreate(BetBase):
    pass

class BetUpdate(BaseModel):
    status: Optional[BetStatus] = None
    actual_result: Optional[str] = None
    payout: Optional[int] = None
    notes: Optional[str] = None

class BetInDB(BetBase):
    id: UUID
    status: BetStatus = BetStatus.PENDING
    created_at: datetime
    updated_at: datetime
    
    # Results (filled when bet is resolved)
    actual_result: Optional[str] = None
    payout: Optional[int] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class BetSummary(BaseModel):
    """Summary of betting activity for a team"""
    team_id: UUID
    week: int
    total_bets: int
    total_wagered: int
    total_won: int
    total_lost: int
    net_profit: int
    win_rate: float
    active_bets: int
    pending_amount: int
