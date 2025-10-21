from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TeamBase(BaseModel):
    espn_team_id: str
    name: str
    league_id: UUID
    owner_id: Optional[UUID] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    owner_id: Optional[UUID] = None

class TeamInDB(TeamBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Team(TeamInDB):
    pass
