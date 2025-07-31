from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpenseBase(BaseModel):
    date: Optional[date] = None
    category: str
    type: str
    amount: float
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str
    type: str  # Wants, Needs, Savings

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        orm_mode = True

class SalaryBase(BaseModel):
    month: str
    amount: float

class SalaryCreate(SalaryBase):
    pass

class Salary(SalaryBase):
    id: int
    class Config:
        orm_mode = True

class RecurringPaymentBase(BaseModel):
    name: str
    amount: float
    due_day: int
    remind_days_before: int

class RecurringPaymentCreate(RecurringPaymentBase):
    pass

class RecurringPayment(RecurringPaymentBase):
    id: int
    class Config:
        orm_mode = True

