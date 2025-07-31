from sqlalchemy.orm import Session
from . import models, schemas
import datetime

# ---- Expense CRUD ----
def get_expenses(db: Session):
    return db.query(models.Expense).all()

def create_expense(db: Session, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(
        date=expense.date or datetime.date.today(),
        category=expense.category,
        type=expense.type,
        amount=expense.amount,
        description=expense.description
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def delete_expense(db: Session, expense_id: int):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if expense:
        db.delete(expense)
        db.commit()
        return True
    return False

# ---- Category CRUD ----
def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name, type=category.type)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session):
    return db.query(models.Category).all()

# ---- Salary CRUD ----
def set_salary(db: Session, salary: schemas.SalaryCreate):
    db_salary = db.query(models.Salary).filter(models.Salary.month == salary.month).first()
    if db_salary:
        db_salary.amount = salary.amount
    else:
        db_salary = models.Salary(month=salary.month, amount=salary.amount)
        db.add(db_salary)
    db.commit()
    db.refresh(db_salary)
    return db_salary

def get_salary(db: Session, month: str):
    return db.query(models.Salary).filter(models.Salary.month == month).first()

def create_recurring_payment(db: Session, rp: schemas.RecurringPaymentCreate):
    db_rp = models.RecurringPayment(**rp.dict())
    db.add(db_rp)
    db.commit()
    db.refresh(db_rp)
    return db_rp

def get_upcoming_reminders(db: Session):
    today = datetime.date.today()
    reminders = []
    all_rp = db.query(models.RecurringPayment).all()
    for rp in all_rp:
        due_date = datetime.date(today.year, today.month, rp.due_day)
        days_left = (due_date - today).days
        if 0 <= days_left <= rp.remind_days_before:
            reminders.append({
                "name": rp.name,
                "amount": rp.amount,
                "due_in_days": days_left
            })
    return reminders

