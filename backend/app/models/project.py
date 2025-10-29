import enum
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, String, Text

from app.core.database import Base


class ProjectStatus(str, enum.Enum):
    Active = "Active"
    OnHold = "On Hold"
    Completed = "Completed"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(Enum(ProjectStatus, name="project_status", native_enum=False), nullable=False, default=ProjectStatus.Active)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
