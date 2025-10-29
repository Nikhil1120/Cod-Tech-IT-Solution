import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Integer, String, Text

from app.core.database import Base


class UserRole(str, enum.Enum):
    Admin = "Admin"
    Manager = "Manager"
    Developer = "Developer"
    Tester = "Tester"


class UserStatus(str, enum.Enum):
    Active = "Active"
    Inactive = "Inactive"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole, name="user_role", native_enum=False), nullable=False, default=UserRole.Developer)
    status = Column(
        Enum(UserStatus, name="user_status", native_enum=False), nullable=False, default=UserStatus.Active
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_login_at = Column(DateTime)
