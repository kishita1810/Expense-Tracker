from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import uuid

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
entries = []

class Entry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    entry_type: str  # "Income" or "Expense"
    type: Optional[str] = None  # "Wants", "Needs", "Savings" for Expense only
    amount: float = Field(..., ge=0, description="Amount must be >= 0")
    description: Optional[str] = ""

    @validator("date")
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

    @validator("entry_type")
    def validate_entry_type(cls, v):
        allowed = ["Income", "Expense"]
        if v not in allowed:
            raise ValueError(f"entry_type must be one of {allowed}")
        return v

    @validator("type", always=True)
    def validate_type_for_expense(cls, v, values):
        if values.get("entry_type") == "Expense":
            if not v or v not in ["Wants", "Needs", "Savings"]:
                raise ValueError("Expense must have type: Wants, Needs, or Savings")
        return v

@app.post("/entries/")
def add_entry(entry: Entry):
    entries.append(entry.dict())
    return {"message": "Entry added successfully", "id": entry.id}

@app.get("/entries/")
def get_entries(month: Optional[str] = None):
    if month:
        # Validate month format YYYY-MM
        try:
            datetime.strptime(month, "%Y-%m")
        except ValueError:
            raise HTTPException(status_code=400, detail="Month must be in YYYY-MM format")

        filtered = [e for e in entries if e["date"].startswith(month)]
        return filtered
    return entries

@app.delete("/entries/{entry_id}")
def delete_entry(entry_id: str):
    global entries
    before_count = len(entries)
    entries = [e for e in entries if e["id"] != entry_id]
    if len(entries) == before_count:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Deleted successfully"}

@app.get("/insights/{month}")
def get_insights(month: str):
    try:
        datetime.strptime(month, "%Y-%m")
    except ValueError:
        raise HTTPException(status_code=400, detail="Month must be in YYYY-MM format")

    filtered = [e for e in entries if e["date"].startswith(month)]

    total_income = sum(e["amount"] for e in filtered if e["entry_type"] == "Income")
    total_expense = sum(e["amount"] for e in filtered if e["entry_type"] == "Expense")

    wants = sum(e["amount"] for e in filtered if e.get("type") == "Wants")
    needs = sum(e["amount"] for e in filtered if e.get("type") == "Needs")
    savings = sum(e["amount"] for e in filtered if e.get("type") == "Savings")

    # Avoid division by zero
    if total_income > 0:
        wants_pct = round((wants / total_income) * 100, 2)
        needs_pct = round((needs / total_income) * 100, 2)
        savings_pct = round((savings / total_income) * 100, 2)
    else:
        wants_pct = needs_pct = savings_pct = 0

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "wants": wants,
        "needs": needs,
        "savings": savings,
        "wants_pct": wants_pct,
        "needs_pct": needs_pct,
        "savings_pct": savings_pct
    }
