from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.backlog import BacklogItem, BacklogPriority, BacklogType, ItemStatus
from app.models.project import Project
from app.models.user import User
from app.schemas.backlog import BacklogCreate, BacklogOut, BacklogStatusUpdate, BacklogUpdate
from app.services.activity_service import log_activity

router = APIRouter(prefix="/backlogs", tags=["Backlogs"]) 


@router.get("", response_model=List[BacklogOut])
def list_backlogs(
    db: Session = Depends(get_db),
    project_id: Optional[int] = None,
    sprint_id: Optional[int] = None,
    status: Optional[str] = None,
    assigned_to: Optional[int] = None,
    priority: Optional[str] = None,
    type: Optional[str] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    _user: User = Depends(get_current_user),
):
    query = db.query(BacklogItem)
    if project_id:
        query = query.filter(BacklogItem.project_id == project_id)
    if sprint_id:
        query = query.filter(BacklogItem.sprint_id == sprint_id)
    if status:
        query = query.filter(BacklogItem.status == ItemStatus(status))
    if assigned_to:
        query = query.filter(BacklogItem.assigned_to_id == assigned_to)
    if priority:
        query = query.filter(BacklogItem.priority == BacklogPriority(priority))
    if type:
        query = query.filter(BacklogItem.type == BacklogType(type))
    if q:
        query = query.filter(BacklogItem.title.contains(q))

    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items


@router.post("", response_model=BacklogOut)
def create_backlog(payload: BacklogCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # ensure project exists
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=400, detail="Project not found")

    item = BacklogItem(
        project_id=payload.project_id,
        sprint_id=payload.sprint_id,
        title=payload.title,
        description=payload.description,
        type=BacklogType(payload.type),
        priority=BacklogPriority(payload.priority),
        status=ItemStatus(payload.status),
        assigned_to_id=payload.assigned_to_id,
        reporter_id=payload.reporter_id,
        effort_estimate=payload.effort_estimate,
        business_value=payload.business_value,
        due_date=payload.due_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    log_activity(db, entity_type="BacklogItem", entity_id=item.id, action="Created backlog item", user_id=user.id)
    return item


@router.get("/{item_id}", response_model=BacklogOut)
def get_backlog(item_id: int, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")
    return item


@router.put("/{item_id}", response_model=BacklogOut)
def update_backlog(item_id: int, payload: BacklogUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")

    item.project_id = payload.project_id
    item.sprint_id = payload.sprint_id
    item.title = payload.title
    item.description = payload.description
    item.type = BacklogType(payload.type)
    item.priority = BacklogPriority(payload.priority)
    item.status = ItemStatus(payload.status)
    item.assigned_to_id = payload.assigned_to_id
    item.reporter_id = payload.reporter_id
    item.effort_estimate = payload.effort_estimate
    item.business_value = payload.business_value
    item.due_date = payload.due_date
    item.updated_at = datetime.utcnow()
    if item.status == ItemStatus.Done:
        item.completed_at = datetime.utcnow()
    else:
        item.completed_at = None

    db.add(item)
    db.commit()
    db.refresh(item)

    log_activity(db, entity_type="BacklogItem", entity_id=item.id, action="Updated backlog item", user_id=user.id)
    return item


@router.patch("/{item_id}/status", response_model=BacklogOut)
def update_status(item_id: int, payload: BacklogStatusUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")

    item.status = ItemStatus(payload.status)
    item.updated_at = datetime.utcnow()
    if item.status == ItemStatus.Done:
        item.completed_at = datetime.utcnow()
    else:
        item.completed_at = None

    db.add(item)
    db.commit()
    db.refresh(item)

    log_activity(db, entity_type="BacklogItem", entity_id=item.id, action=f"Changed status to {item.status.value}", user_id=user.id)
    return item


@router.delete("/{item_id}")
def delete_backlog(item_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    item = db.query(BacklogItem).filter(BacklogItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Backlog item not found")

    db.delete(item)
    db.commit()

    log_activity(db, entity_type="BacklogItem", entity_id=item_id, action="Deleted backlog item", user_id=user.id)
    return {"success": True}
