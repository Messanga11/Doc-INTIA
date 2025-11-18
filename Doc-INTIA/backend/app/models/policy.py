from sqlalchemy import Column, Integer, String, DateTime, Date, Numeric, Text, func, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    policy_number = Column(String(50), nullable=False, unique=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    coverage = Column(Text, nullable=False)
    premium = Column(Numeric(10, 2), nullable=False)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Constraints
    __table_args__ = (
        CheckConstraint("end_date > start_date", name="check_end_date_after_start"),
        CheckConstraint("status IN ('active', 'pending', 'cancelled', 'expired')", name="check_valid_status"),
        CheckConstraint("premium > 0", name="check_positive_premium"),
    )

    # Relationships
    client = relationship("Client", back_populates="policies")
    branch = relationship("Branch", back_populates="policies")

    def __repr__(self):
        return f"<InsurancePolicy(id={self.id}, policy_number='{self.policy_number}', client_id={self.client_id}, status='{self.status}')>"
