from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TokenBalanceBase(BaseModel):
    team_id: UUID
    week: int
    starting_balance: int = 1000
    current_balance: int
    weekly_used: int = 0

class TokenBalanceCreate(TokenBalanceBase):
    pass

class TokenBalanceUpdate(BaseModel):
    current_balance: Optional[int] = None
    weekly_used: Optional[int] = None

class TokenBalanceInDB(TokenBalanceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TokenBalance(TokenBalanceInDB):
    pass

class TokenTransactionBase(BaseModel):
    team_id: UUID
    week: int
    amount: int
    transaction_type: str  # 'allocation', 'bet', 'win', 'loss'
    description: str

class TokenTransactionCreate(TokenTransactionBase):
    pass

class TokenTransactionInDB(TokenTransactionBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TokenTransaction(TokenTransactionInDB):
    pass
