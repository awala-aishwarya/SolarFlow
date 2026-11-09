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
│   ├
