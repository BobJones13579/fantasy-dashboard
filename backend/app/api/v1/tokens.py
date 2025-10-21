from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from uuid import UUID
from app.services.token_service import TokenService
from app.models.token import TokenBalance, TokenTransaction

router = APIRouter()

# Dependency to get token service
def get_token_service() -> TokenService:
    return TokenService()

@router.get("/balance/{team_id}/{week}", response_model=TokenBalance)
async def get_token_balance(
    team_id: UUID,
    week: int,
    token_service: TokenService = Depends(get_token_service)
):
    """Get token balance for a team in a specific week"""
    balance = await token_service.get_balance(team_id, week)
    if not balance:
        raise HTTPException(status_code=404, detail="Token balance not found")
    return balance

@router.post("/allocate/{team_id}/{week}", response_model=TokenBalance)
async def allocate_tokens(
    team_id: UUID,
    week: int,
    token_service: TokenService = Depends(get_token_service)
):
    """Allocate weekly tokens for a team"""
    balance = await token_service.allocate_weekly_tokens(team_id, week)
    if not balance:
        raise HTTPException(status_code=400, detail="Failed to allocate tokens")
    return balance

@router.post("/deduct/{team_id}/{week}")
async def deduct_tokens(
    team_id: UUID,
    week: int,
    amount: int,
    description: str = "Token deduction",
    token_service: TokenService = Depends(get_token_service)
):
    """Deduct tokens from team balance"""
    success = await token_service.deduct_tokens(team_id, amount, week, description)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to deduct tokens or insufficient balance")
    return {"message": "Tokens deducted successfully", "amount": amount}

@router.post("/add/{team_id}/{week}")
async def add_tokens(
    team_id: UUID,
    week: int,
    amount: int,
    description: str = "Token addition",
    token_service: TokenService = Depends(get_token_service)
):
    """Add tokens to team balance"""
    success = await token_service.add_tokens(team_id, amount, week, description)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to add tokens")
    return {"message": "Tokens added successfully", "amount": amount}

@router.get("/transactions/{team_id}", response_model=List[TokenTransaction])
async def get_transaction_history(
    team_id: UUID,
    week: Optional[int] = None,
    token_service: TokenService = Depends(get_token_service)
):
    """Get transaction history for a team"""
    transactions = await token_service.get_transaction_history(team_id, week)
    return transactions

@router.post("/reset/{week}")
async def weekly_token_reset(
    week: int,
    token_service: TokenService = Depends(get_token_service)
):
    """Reset tokens for all teams for a new week (admin function)"""
    success = await token_service.weekly_token_reset(week)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to reset tokens")
    return {"message": f"Weekly token reset completed for week {week}"}
