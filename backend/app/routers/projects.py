from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.project import Project, ProjectStatus
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.services.activity_service import log_activity

router = APIRouter(prefix="/projects", tags=["Projects"]) 


@router.get("", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    q: Optional[str] = None,
    status: Optional[str] = None,
    owner_id: Optional[int] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    _user: User = Depends(get_current_user),
):
    query = db.query(Project)
    if q:
        query = query.filter(Project.name.contains(q))
    if status:
        query = query.filter(Project.status == ProjectStatus(status))
    if owner_id:
        query = query.filter(Project.owner_id == owner_id)
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items


@router.post("", response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # ensure owner exists
    owner = db.query(User).filter(User.id == payload.owner_id).first()
    if not owner:
        raise HTTPException(status_code=400, detail="Owner not found")

    project = Project(
        name=payload.name,
        description=payload.description,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status=ProjectStatus(payload.status),
        owner_id=payload.owner_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    log_activity(db, entity_type="Project", entity_id=project.id, action="Created project", user_id=user.id)
    return project


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    project.name = payload.name
    project.description = payload.description
    project.start_date = payload.start_date
    project.end_date = payload.end_date
    project.status = ProjectStatus(payload.status)
    project.owner_id = payload.owner_id
    project.updated_at = datetime.utcnow()

    db.add(project)
    db.commit()
    db.refresh(project)

    log_activity(db, entity_type="Project", entity_id=project.id, action="Updated project", user_id=user.id)
    return project


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()

    log_activity(db, entity_type="Project", entity_id=project_id, action="Deleted project", user_id=user.id)
    return {"success": True}
