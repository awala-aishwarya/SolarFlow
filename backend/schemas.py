
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(pattern=r"^[0-9]{10}$")
    ownership: str
    roof_type: str
    roof_area: float = Field(gt=0)
    monthly_bill: float = Field(gt=0)
    pincode: str = Field(pattern=r"^[0-9]{6}$")
    avg_units: Optional[float] = Field(default=None, gt=0)


class LeadResponse(LeadCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    lead_id: str
    score: str
    status: str
