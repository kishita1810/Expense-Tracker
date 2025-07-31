from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    category = Column(String, index=True)  # e.g., Food, Rent
    type = Column(String)  # Wants, Needs, Savings
    amount = Column(Float)
    description = Column(String, nullable=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    type = Column(String)  # Wants, Needs, Savings

class Salary(Base):
    __tablename__ = "salary"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, unique=True)  # e.g., "2025-07"
    amount = Column(Float)

class RecurringPayment(Base):
    __tablename__ = "recurring_payments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    amount = Column(Float)
    due_day = Column(Integer)  # day of the month
    remind_days_before = Column(Integer)  # how many days before due date to remind

