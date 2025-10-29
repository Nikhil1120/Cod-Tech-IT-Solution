from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: Literal["Admin", "Manager", "Developer", "Tester"]
    status: Literal["Active", "Inactive"]
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True
