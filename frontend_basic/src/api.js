import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getInsights = (month) => API.get(`/insights/${month}`);
export const getExpenses = () => API.get('/expenses/');
export const addExpense = (data) => API.post('/expenses/', data);
export const addCategory = (data) => API.post('/categories/', data);
export const setSalary = (data) => API.post('/salary/', data);
export const getReminders = () => API.get('/reminders/');
