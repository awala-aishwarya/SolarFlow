from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes.projects import router as projects_router
from models import Lead
from routes.leads import router as leads_router
load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SolarFlow API",
    description="AI-Powered Solar Lead Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(leads_router)
app.include_router(projects_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to SolarFlow API",
        "status": "Running successfully"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
