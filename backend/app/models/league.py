from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class LeagueBase(BaseModel):
    name: str
    espn_league_id: str
    season: int
    settings: Optional[Dict[str, Any]] = None

class LeagueCreate(LeagueBase):
    pass

class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class LeagueInDB(LeagueBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class League(LeagueInDB):
    pass
