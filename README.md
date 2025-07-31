# Expense Tracker Web App

The Expense Tracker Web App is a personal finance management tool designed to help you
track, analyze, and optimize your income, expenses, and savings.
It provides a clear overview of your monthly spending habits, and visually represents your financial data using charts and graphs.

It is an example of a **full-stack project** that integrates a FastAPI backend
with a React frontend.

---
## 📽 Live Demo
[![Watch the video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/YOUR_VIDEO_ID)

Click the image above to watch a quick demo of the Expense Tracker Web App in action.
---
## Features
### 1. Add & Remove Entries
- Add income or expenses with a simple form.
- Categorize expenses into **Wants**, **Needs**, or **Savings**.
- Remove entries anytime to keep your records clean.
  
### 2. Income vs Expense Tracking
- Clearly see how much you have earned and spent for the current month.
- Easily identify overspending patterns.
  
### 3. Budget Categories
- Create personalized budget categories for better tracking.
- Group categories into **Wants**, **Needs**, and **Savings** for a high-level overview.
  
### 4. Automatic Insights
- Calculates what percentage of your income goes into Wants, Needs, and Savings.
- Highlights potential overspending or savings opportunities.
  
### 5. Graphs & Charts
- Interactive pie charts for category breakdowns.
- Bar charts for monthly income and expense trends.
- Clear visual representation for easier decision-making.
  
### 6. Monthly Filters
- View transactions for any selected month.
- Helps in tracking financial progress over time.

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
