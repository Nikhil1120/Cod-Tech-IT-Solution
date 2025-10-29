import enum
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text

from app.core.database import Base


class BacklogType(str, enum.Enum):
    Feature = "Feature"
    Bug = "Bug"
    Task = "Task"
    ChangeRequest = "Change Request"


class BacklogPriority(str, enum.Enum):
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"
    P4 = "P4"


class ItemStatus(str, enum.Enum):
    Draft = "Draft"
    ToDo = "ToDo"
    InProgress = "InProgress"
    InReview = "InReview"
    Done = "Done"


class BacklogItem(Base):
    __tablename__ = "backlog_items"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    sprint_id = Column(Integer, ForeignKey("sprints.id", ondelete="SET NULL"))

    title = Column(String(200), nullable=False)
    description = Column(Text)

    type = Column(Enum(BacklogType, name="backlog_type", native_enum=False), nullable=False, default=BacklogType.Feature)
    priority = Column(
        Enum(BacklogPriority, name="backlog_priority", native_enum=False), nullable=False, default=BacklogPriority.P3
    )
    status = Column(Enum(ItemStatus, name="item_status", native_enum=False), nullable=False, default=ItemStatus.ToDo)

    assigned_to_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)

    effort_estimate = Column(Numeric(10, 2))
    business_value = Column(Numeric(10, 2))
    due_date = Column(Date)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    completed_at = Column(DateTime)
