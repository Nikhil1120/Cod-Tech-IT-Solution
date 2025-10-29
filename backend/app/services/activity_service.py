from typing import Optional, Dict
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.activity import ActivityLog


def log_activity(
    db: Session,
    *,
    entity_type: str,
    entity_id: int,
    action: str,
    user_id: Optional[int] = None,
    metadata: Optional[Dict] = None,
) -> None:
    entry = ActivityLog(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        user_id=user_id,
        metadata=metadata or {},
        created_at=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
