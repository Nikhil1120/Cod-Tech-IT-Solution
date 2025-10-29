from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text, BigInteger

from app.core.database import Base


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("backlog_items.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(Text, nullable=False)
    file_path = Column(Text, nullable=False)
    content_type = Column(Text)
    size_bytes = Column(BigInteger)
    uploaded_by_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=datetime.utcnow)
