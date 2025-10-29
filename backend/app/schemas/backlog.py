from datetime import date, datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class BacklogBase(BaseModel):
    project_id: int
    sprint_id: Optional[int] = None
    title: str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    type: Literal["Feature", "Bug", "Task", "Change Request"] = "Feature"
    priority: Literal["P1", "P2", "P3", "P4"] = "P3"
    status: Literal["Draft", "ToDo", "InProgress", "InReview", "Done"] = "ToDo"
    assigned_to_id: Optional[int] = None
    reporter_id: int
    effort_estimate: Optional[float] = None
    business_value: Optional[float] = None
    due_date: Optional[date] = None


class BacklogCreate(BacklogBase):
    pass


class BacklogUpdate(BacklogBase):
    pass


class BacklogStatusUpdate(BaseModel):
    status: Literal["Draft", "ToDo", "InProgress", "InReview", "Done"]


class BacklogOut(BacklogBase):
    id: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
