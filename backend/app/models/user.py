from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    display_name: str
    espn_user_id: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    display_name: Optional[str] = None
    espn_user_id: Optional[str] = None

class UserInDB(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserInDB):
    pass
