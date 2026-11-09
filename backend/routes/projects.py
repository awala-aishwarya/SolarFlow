
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, Lead
from secrets import token_hex, token_urlsafe

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

PROJECT_STAGES = [
    "Survey Scheduled",
    "Quotation Shared",
    "Advance Received",
    "Installation In Progress",
    "Installation Completed",
    "Net Metering Documentation",
    "Subsidy Credited"
]


# 1. CREATE PROJECT
@router.post("/{lead_id}")
def create_project(
    lead_id: str,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(
        Lead.lead_id == lead_id
    ).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    if not lead.recommended_kw:
        raise HTTPException(
            status_code=400,
            detail="Qualify the lead before creating a project"
        )

    existing = db.query(Project).filter(
        Project.lead_id == lead_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Project already exists for this lead"
        )

    project = Project(
        project_id=f"PRJ-{token_hex(3).upper()}",
        lead_id=lead.lead_id,
        customer_name=lead.name,
        system_capacity_kw=lead.recommended_kw,
        project_status="Survey Scheduled",
        tracking_token=token_urlsafe(24)
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project created successfully",
        "project_id": project.project_id,
        "lead_id": project.lead_id,
        "customer_name": project.customer_name,
        "project_status": project.project_status
    }


# 2. GET ALL PROJECTS
@router.get("/")
def get_all_projects(
    db: Session = Depends(get_db)
):
    return db.query(Project).order_by(
        Project.id.desc()
    ).all()


# 3. UPDATE PROJECT STATUS
@router.patch("/{project_id}/status")
def update_project_status(
    project_id: str,
    new_status: str,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if new_status not in PROJECT_STAGES:
        raise HTTPException(
            status_code=400,
            detail="Invalid project status"
        )

    project.project_status = new_status

    # Update subsidy status when project reaches final stage
    if new_status == "Subsidy Credited":
        project.subsidy_status = "Credited"

    db.commit()
    db.refresh(project)

    return {
        "message": "Project status updated",
        "project_id": project.project_id,
        "new_status": project.project_status
    }


# 4. GENERATE OR RETRIEVE CUSTOMER TRACKING LINK
@router.get("/{project_id}/tracking-link")
def get_tracking_link(
    project_id: str,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Generate token for older projects
    if not project.tracking_token:
        project.tracking_token = token_urlsafe(24)
        db.commit()
        db.refresh(project)

    return {
        "project_id": project.project_id,
        "tracking_url": (
            "http://localhost:5173/track/"
            + project.tracking_token
        )
    }


# 5. PUBLIC CUSTOMER PROJECT TRACKING
@router.get("/track/{token}")
def track_customer_project(
    token: str,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.tracking_token == token
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Invalid tracking link"
        )

    current_index = PROJECT_STAGES.index(
        project.project_status
    )

    timeline = [
        {
            "stage": stage,
            "completed": index <= current_index
        }
        for index, stage in enumerate(PROJECT_STAGES)
    ]

    return {
        "project_id": project.project_id,
        "customer_name": project.customer_name,
        "system_capacity_kw": project.system_capacity_kw,
        "current_status": project.project_status,
        "timeline": timeline,
        "subsidy_status": project.subsidy_status
    }
