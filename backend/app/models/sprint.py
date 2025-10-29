import enum
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, String, Text, UniqueConstraint

from app.core.database import Base


class SprintStatus(str, enum.Enum):
    Planned = "Planned"
    Active = "Active"
    Closed = "Closed"


class Sprint(Base):
    __tablename__ = "sprints"
    __table_args__ = (
        UniqueConstraint("project_id", "name", name="uq_sprint_project_name"),
    )

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    goal = Column(Text)
    status = Column(Enum(SprintStatus, name="sprint_status", native_enum=False), nullable=False, default=SprintStatus.Planned)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
