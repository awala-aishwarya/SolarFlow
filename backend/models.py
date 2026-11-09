
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(String(20), unique=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)

    ownership = Column(String(20), nullable=False)
    roof_type = Column(String(50), nullable=False)
    roof_area = Column(Float, nullable=False)

    monthly_bill = Column(Float, nullable=False)
    pincode = Column(String(6), nullable=False)

    avg_units = Column(Float, nullable=True)
    recommended_kw = Column(Float, nullable=True)

    score = Column(String(20), default="Pending")
    status = Column(String(30), default="New")

    bill_file = Column(String(255), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(String(30), unique=True, index=True)

    tracking_token = Column(
    String(64),
    unique=True,
    index=True,
    nullable=True
)

    lead_id = Column(String(20), nullable=False, index=True)

    customer_name = Column(String(100), nullable=False)

    system_capacity_kw = Column(Float, nullable=False)

    project_status = Column(
        String(50),
        default="Survey Scheduled"
    )

    advance_paid = Column(Float, default=0)

    installation_cost = Column(Float, default=0)

    subsidy_status = Column(
        String(50),
        default="Not Applied"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    

