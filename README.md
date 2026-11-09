# ☀️ SolarFlow
### Smart Rooftop Solar Lead Qualification, Quotation & Project Tracking Platform

SolarFlow is a full-stack web application designed to streamline the operations of rooftop solar installation businesses. It provides a centralized platform for customer lead management, electricity bill uploads, rule-based lead qualification, solar quotation calculations, and installation project tracking.

Developed as part of the **ISO Code Labs – Software Engineering Intern Assignment (Problem Statement 2)**.

## 🚀 Features

### 1. Lead Management
- Register rooftop solar customer enquiries.
- Capture customer contact information, ownership, roof type, roof area, monthly electricity bill, pincode and electricity consumption.
- Generate unique lead IDs.
- View leads through a live dashboard.

### 2. Electricity Bill Upload
- Upload electricity bills in PDF, JPG, JPEG or PNG format.
- Validate file types and sizes.
- Associate uploaded bills with customer leads.

**Current limitation:** Automated AI/OCR extraction of bill details is planned but not yet implemented.

### 3. Intelligent Lead Qualification
A deterministic Python scoring engine evaluates leads using:
- Property ownership
- Monthly electricity consumption
- Electricity bill amount
- Available roof area

The system assigns **High, Medium or Low** priority and recommends an appropriate next action.

### 4. Solar Quotation Engine
Calculates:
- Recommended solar system capacity
- Estimated annual electricity generation
- Installation cost
- Illustrative government subsidy
- Net installation cost
- Estimated annual savings
- Payback period

The application uses an illustrative annual generation assumption of **1,400 units per kW**.

Financial estimates use configurable prototype assumptions and should be verified before commercial use.

### 5. PDF Quotation Generation
- Generates downloadable quotation PDFs.
- Includes system capacity, costs, subsidy estimates and financial projections.
- Uses ReportLab for PDF generation.

### 6. Project Tracking
- Create installation projects from qualified leads.
- Update project progress through predefined stages.
- Generate customer-specific tracking links.
- Display completed and upcoming milestones on a customer-facing page.

**Project stages:**
1. Survey Scheduled
2. Quotation Shared
3. Advance Received
4. Installation In Progress
5. Installation Completed
6. Net Metering Documentation
7. Subsidy Credited

### 7. Live Dashboard
- Total leads
- Qualified leads
- Projects created
- Active projects
- Recent customer enquiries
- Recent project statuses
- Pending follow-ups

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| PDF generation | ReportLab |
| API communication | REST API, Fetch API |

## 📁 Project Structure

```text
solarflow/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── leads.py
│   │   └── projects.py
│   ├── services/
│   │   ├── bill_reader.py
│   │   ├── lead_scoring.py
│   │   ├── quotation_engine.py
│   │   └── pdf_generator.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── NewLead.tsx
│   │   ├── TrackProject.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
├── TDD.docx
├── deployment.md
└── .gitignore
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### Step 1: Clone the repository

```bash
git clone https://github.com/awala-aishwarya/SolarFlow.git
cd SolarFlow
```

### Step 2: Set up the backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Start the backend:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

Backend URL: http://127.0.0.1:8000

Swagger API documentation: http://127.0.0.1:8000/docs

### Step 3: Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

If PowerShell blocks the npm command, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Frontend URL: http://localhost:5173

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/leads/` | Create a new lead |
| GET | `/leads/` | List all leads |
| GET | `/leads/{lead_id}` | Retrieve lead details |
| POST | `/leads/{lead_id}/bill` | Upload electricity bill |
| POST | `/leads/{lead_id}/score` | Score lead |
| POST | `/leads/{lead_id}/quote` | Calculate quotation |
| GET | `/leads/{lead_id}/quote/pdf` | Download quotation PDF |
| POST | `/projects/{lead_id}` | Create project |
| GET | `/projects/` | List projects |
| PATCH | `/projects/{project_id}/status` | Update project stage |
| GET | `/projects/{project_id}/tracking-link` | Generate tracking link |
| GET | `/projects/track/{token}` | Customer tracking data |

## 🧪 Demo Workflow

1. Open the SolarFlow dashboard.
2. Click **Add New Lead**.
3. Enter sample customer and electricity details.
4. Optionally upload a sample electricity bill.
5. Save the lead and run lead scoring.
6. View the new lead and priority on the dashboard.
7. Use Swagger to generate a quotation and create a project.
8. Update the project status using the API.
9. Generate a tracking link.
10. Open the customer tracking page to view progress.

## 🔐 Security and Privacy

- Request validation through Pydantic.
- Upload file type and size restrictions.
- Unique customer tracking tokens.
- Environment variables for API keys.
- Local databases, uploaded customer bills and secrets excluded from version control.

**Note:** This is an assignment prototype, not a production-ready system. Production use requires authentication, authorization, secure file storage and additional privacy controls.

## 🔮 Planned Enhancements

- AI/OCR electricity bill extraction.
- Confirmation and correction of extracted values.
- Full quotation builder frontend.
- Staff project management interface.
- WhatsApp/SMS status notifications.
- Stuck-project monitoring.
- Admin pricing and subsidy management.
- Role-based authentication.
- Marathi and Hindi language support.
- Automated tests and cloud deployment.

## 📄 Documentation

- `TDD.docx` – Technical Design Document
- `deployment.md` – Local setup and deployment instructions

## 👩‍💻 Developer

**Awala Aishwarya**

B.Tech – Artificial Intelligence & Machine Learning

GitHub: https://github.com/awala-aishwarya

## 📌 Project Status

**Functional MVP – Local Development**

The core lead management, bill upload, qualification, quotation calculation, PDF generation and project tracking backend are implemented. The dashboard, lead form and customer tracking frontend are operational.

Additional integrations and administrative workflows are planned for future development.

---

*Built for the ISO Code Labs Software Engineering Intern Assignment.*
