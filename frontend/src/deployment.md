# SolarFlow – Local Setup and Deployment Guide

## 1. Prerequisites

Install the following:
- Python 3.10 or later
- Node.js and npm
- Visual Studio Code (recommended)

## 2. Project Structure

```text
solarflow/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── quotes/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── TDD.docx
└── deployment.md
```

## 3. Backend Setup

Open a terminal in the backend directory:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Install dependencies:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Create a `.env` file if required by your local configuration. Add environment variables using your own private values.

Example variable names:

```env
GEMINI_API_KEY=your_private_api_key
```

Do not commit real API keys to Git.

Start the backend:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

## 4. Frontend Setup

Open a second terminal:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Frontend URL:

`http://localhost:5173`

Keep both frontend and backend terminals running during local use.

## 5. Environment Variables

The application may use the following environment variable:

| Variable | Purpose |
|---|---|
| GEMINI_API_KEY | Reserved for optional Gemini integration |

Do not include actual API keys in the submission ZIP.

## 6. Database

The backend uses SQLite.

The database is created locally when the backend initializes its SQLAlchemy models. The local database file is named `solarflow.db`.

For a clean review, the reviewer can start with a fresh database and create sample leads and projects through the application and API.

## 7. Reviewer Demo Flow

1. Start the backend.
2. Start the frontend.
3. Open `http://localhost:5173`.
4. Review the dashboard.
5. Select Add New Lead.
6. Enter sample customer and rooftop information.
7. Optionally upload a sample electricity bill.
8. Save the lead and run the deterministic scoring engine.
9. Open the backend API documentation to inspect lead and project endpoints.
10. Create a project from a lead through the API.
11. Generate a tracking link and open the customer tracking page.
12. Test project status updates using the API documentation.

## 8. Current Implementation Notes

Implemented:
- Lead registration and retrieval
- Electricity bill file upload
- Deterministic lead scoring
- Solar quotation calculations
- Quotation PDF generation
- Project creation and stage updates
- Customer project tracking

Not implemented in this MVP:
- Automated OCR/LLM bill extraction and customer confirmation
- WhatsApp/SMS delivery
- Production authentication and role management
- Production deployment

## 9. Production Deployment Considerations

Before production use:
- Configure HTTPS and secure CORS origins.
- Use a production database.
- Add authentication and role-based authorization.
- Validate uploaded file contents and enforce storage limits.
- Protect customer tracking tokens and personal data.
- Configure secure secret management.
- Add logging, monitoring and automated tests.
- Verify electricity pricing and subsidy rules against current official sources.

## 10. Submission Information

Project name: SolarFlow

Repository URL: Not yet published.

Live application URL: Not deployed. The application currently runs locally.

Demo credentials: Not applicable; authentication is not implemented.

The reviewer can run the application locally using the instructions above.