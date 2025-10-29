from datetime import datetime
from pydantic import BaseModel


class CommentCreate(BaseModel):
    comment_text: str


class CommentOut(BaseModel):
    id: int
    item_id: int
    comment_text: str
    created_by_id: int
    created_at: datetime

    class Config:
        from_attributes = True
