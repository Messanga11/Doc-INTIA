from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    code = Column(String(10), nullable=False, unique=True)
    address = Column(String, nullable=False)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    clients = relationship("Client", back_populates="branch")
    policies = relationship("InsurancePolicy", back_populates="branch")
    users = relationship("User", back_populates="branch")

    def __repr__(self):
        return f"<Branch(id={self.id}, name='{self.name}', code='{self.code}')>"
