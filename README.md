# Expense Tracker Web App
A personal finance tracker web application that helps you manage income, expenses, and
budgets.
Includes **two frontend versions**:
- **frontend_basic** -> Minimal React app with all functionality (built manually)
- **frontend_modern** -> Modern, stylish version (built with Lovable AI)
Backend is built with **FastAPI**.
---
## Features
- **Add & Remove Entries** -> Track both income and expenses
- **Income vs Expense View** -> See totals for each month
- **Budget Categories**:
 - Wants
 - Needs
 - Savings
- **Automatic Insights**:
 - % of salary spent on Wants, Needs, Savings
 - Total earned and total spent per month
 - Month-to-month spending comparison
- **Graphs & Charts** -> Visual representation of expenses and income
- **Monthly Filter** -> Only see data for selected month
- **Data Verification Prompt** -> End-of-month balance check to catch missing entries
---
## Folder Structure
```
backend/ -> FastAPI backend API
frontend_basic/ -> Basic React frontend
frontend_modern/ -> Modern styled frontend
```
---
## How to Run
### Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate # Mac/Linux
venv\Scripts\activate # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend will run on:
http://127.0.0.1:8000
---
### Frontend - Basic Version
```bash
cd frontend_basic
npm install
npm start
```
App will run on:
http://localhost:3000
---
### Frontend - Modern Version
```bash
cd frontend_modern
npm install
npm start
```
App will run on:
http://localhost:3000
---
## API Endpoints
```
GET /entries/ -> Get all entries
POST /entries/ -> Add income/expense
DELETE /entries/{id} -> Delete an entry
```
---
## Tech Stack
- **Backend** -> FastAPI (Python)
- **Frontend** -> React.js
- **UI Styling** -> CSS / Tailwind (modern version)
- **Charts** -> Chart.js
---
## License
MIT License - free to use and modify.
