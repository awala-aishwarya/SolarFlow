
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File
)
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from services.pdf_generator import generate_quotation_pdf
from services.quotation_engine import generate_quote
from services.lead_scoring import calculate_lead_score
from sqlalchemy import func
from pathlib import Path
from secrets import token_hex

from database import get_db
from models import Lead
from schemas import LeadCreate, LeadResponse

router = APIRouter(prefix="/leads", tags=["Leads"])

# Upload directory
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png"
}


# 1. CREATE A NEW LEAD
@router.post("/", response_model=LeadResponse)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db)
):
    lead_id = f"LD-{token_hex(3).upper()}"

    new_lead = Lead(
        lead_id=lead_id,
        name=lead_data.name,
        phone=lead_data.phone,
        ownership=lead_data.ownership,
        roof_type=lead_data.roof_type,
        roof_area=lead_data.roof_area,
        monthly_bill=lead_data.monthly_bill,
        pincode=lead_data.pincode,
        score="Pending",
        status="New"
    )

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return new_lead


# 2. GET ALL LEADS
@router.get("/", response_model=list[LeadResponse])
def get_all_leads(
    db: Session = Depends(get_db)
):
    return db.query(Lead).order_by(
        Lead.id.desc()
    ).all()


# 3. QUALIFY AND SCORE A LEAD
@router.post("/{lead_id}/score")
def score_lead(
    lead_id: str,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        func.upper(func.trim(Lead.lead_id))
        == lead_id.strip().upper()
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # Calculate lead qualification
    result = calculate_lead_score(lead)

    # Save calculated information
    lead.score = result["priority"]
    lead.avg_units = result["monthly_units"]
    lead.recommended_kw = result["recommended_kw"]

    db.commit()
    db.refresh(lead)

    return {
        "message": "Lead qualified successfully",
        "lead_id": lead.lead_id,
        **result
    }



# 3. GET A LEAD USING LEAD ID
@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: str,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        func.upper(func.trim(Lead.lead_id))
        == lead_id.strip().upper()
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return lead


# 5. GENERATE SOLAR QUOTATION
@router.post("/{lead_id}/quote")
def create_quote(
    lead_id: str,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        func.upper(func.trim(Lead.lead_id))
        == lead_id.strip().upper()
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    if lead.recommended_kw is None or lead.recommended_kw <= 0:
        raise HTTPException(
            status_code=400,
            detail="Please qualify the lead before generating a quotation"
        )

    quotation = generate_quote(lead.recommended_kw)

    return {
        "message": "Solar quotation generated successfully",
        "lead_id": lead.lead_id,
        "customer_name": lead.name,
        **quotation
    }

# 6. DOWNLOAD SOLAR QUOTATION PDF
@router.get("/{lead_id}/quote/pdf")
def download_quote_pdf(
    lead_id: str,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        func.upper(func.trim(Lead.lead_id))
        == lead_id.strip().upper()
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    if lead.recommended_kw is None or lead.recommended_kw <= 0:
        raise HTTPException(
            status_code=400,
            detail="Qualify lead before generating quotation"
        )

    quotation = generate_quote(lead.recommended_kw)

    pdf_path = generate_quotation_pdf(
        lead.name,
        lead.lead_id,
        quotation
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{lead.lead_id}_quotation.pdf"
    )



# 4. UPLOAD ELECTRICITY BILL
@router.post("/{lead_id}/bill")
async def upload_bill(
    lead_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    try:
        # Find lead
        lead = db.query(Lead).filter(
            func.upper(func.trim(Lead.lead_id))
            == lead_id.strip().upper()
        ).first()

        if not lead:
            raise HTTPException(
                status_code=404,
                detail="Lead not found"
            )

        # Validate file extension
        extension = Path(file.filename or "").suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Only PDF, JPG, JPEG and PNG files are allowed"
            )

        # Read file
        content = await file.read()

        # Validate file size
        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size must not exceed 5 MB"
            )

        # Validate actual file type
        valid_file = False

        if extension == ".pdf":
            valid_file = content.startswith(b"%PDF")

        elif extension in [".jpg", ".jpeg"]:
            valid_file = content.startswith(b"\xff\xd8\xff")

        elif extension == ".png":
            valid_file = content.startswith(
                b"\x89PNG\r\n\x1a\n"
            )

        if not valid_file:
            raise HTTPException(
                status_code=400,
                detail="File content does not match its extension"
            )

        # Generate unique filename
        filename = f"{token_hex(16)}{extension}"

        file_path = UPLOAD_DIR / filename

        # Save uploaded bill
        with open(file_path, "wb") as uploaded_file:
            uploaded_file.write(content)

        # Update lead record
        lead.bill_file = filename

        db.commit()
        db.refresh(lead)

        print("BILL UPLOAD SUCCESSFUL:", filename)

        # Return successful upload response
        return {
            "message": "Electricity bill uploaded successfully",
            "lead_id": lead.lead_id,
            "filename": filename,
            "file_size": len(content),
            "status": "Uploaded"
        }

    finally:
        await file.close()
