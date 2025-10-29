from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.backlog import BacklogItem
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentOut
from app.services.activity_service import log_activity

router = APIRouter(prefix="/comments", tags=["Comments"]) 


@router.get("/{item_id}", response_model=List[CommentOut])
def list_comments(item_id: int, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    comments = db.query(Comment).filter(Comment.item_id == item_id).order_by(Comment.created_at.asc()).all()
    return comments


@router.post("/{item_id}", response_model=CommentOut)
def add_comment(item_id: int, payload: CommentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")

    comment = Comment(item_id=item_id, comment_text=payload.comment_text, created_by_id=user.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)

    log_activity(db, entity_type="BacklogItem", entity_id=item_id, action="Added comment", user_id=user.id)
    return comment
