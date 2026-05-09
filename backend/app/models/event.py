from sqlalchemy import Column, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.base import TimestampMixin


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    event_metadata = Column("metadata", JSON, nullable=False, default=dict)

    user = relationship("User")
