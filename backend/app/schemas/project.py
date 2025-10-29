from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Literal["Active", "On Hold", "Completed"] = "Active"
    owner_id: int


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
