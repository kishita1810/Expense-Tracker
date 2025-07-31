import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

ChartJS.register(ChartDataLabels);
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_URL = "http://127.0.0.1:8000"; // Backend URL

interface Entry {
  id: string;
  date: string;
  entry_type: string;
  type?: string;
  amount: number;
  description?: string;
}

interface Insights {
  wants?: number;
  needs?: number;
  savings?: number;
  total_income?: number;
  total_expense?: number;
}

const ExpenseTracker = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState("");
  const [entryType, setEntryType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [insights, setInsights] = useState<Insights>({});
  const { toast } = useToast();

  // Fetch entries from backend
  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_URL}/entries/`, { params: { month } });
      setEntries(res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch entries",
        variant: "destructive",
      });
    }
  };

  // Fetch insights from backend
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API_URL}/insights/${month}`);
      setInsights(res.data);
    } catch (err) {
      console.error("Error fetching insights:", err);
    }
  };

  // Add entry to backend
  const handleAdd = async () => {
    if (!date || !entryType || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (entryType === "Expense" && !category) {
      toast({
        title: "Missing Category",
        description: "Please select a category for the expense.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${API_URL}/entries/`, {
        date,
        entry_type: entryType,
        type: entryType === "Expense" ? category : null,
        amount: parseFloat(amount),
        description
      });
      resetForm();
      fetchEntries();
      fetchInsights();
      toast({
        title: "Success",
        description: `${entryType} added successfully!`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Error adding entry",
        variant: "destructive",
      });
    }
  };

  // Delete entry by UUID
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/entries/${id}`);
      fetchEntries();
      fetchInsights();
      toast({
        title: "Deleted",
        description: "Entry deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error deleting entry",
        variant: "destructive",
      });
    }
  };

  // Reset input fields
  const resetForm = () => {
    setDate("");
    setEntryType("");
    setCategory("");
    setAmount("");
    setDescription("");
  };

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, [month]);

  // Chart data with modern styling
  const pieData = {
    labels: ["Wants", "Needs", "Savings"],
    datasets: [
      {
        data: [
          Number(insights.wants) || 0,
          Number(insights.needs) || 0,
          Number(insights.savings) || 0
        ],
        backgroundColor: [
          "hsl(0, 75%, 60%)",
          "hsl(45, 90%, 55%)",
          "hsl(140, 70%, 45%)"
        ],
        borderWidth: 0,
        borderRadius: 8,
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: 'normal' as const
          }
        }
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold" as const, size: 12 },
        formatter: (value: number, context: any) => {
          if (value === 0) return "";
          const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `$${value.toLocaleString()}\n(${percentage}%)`;
        }
      }
    }
  };

  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [
          Number(insights.total_income) || 0,
          Number(insights.total_expense) || 0
        ],
        backgroundColor: [
          "hsl(140, 70%, 45%)",
          "hsl(0, 75%, 60%)"
        ],
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        anchor: "end" as const,
        align: "top" as const,
        color: "#333",
        font: { weight: "bold" as const, size: 12 },
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))'
        },
        ticks: {
          callback: (value: any) => `$${value.toLocaleString()}`,
          padding: 10
        },
        // Ensure adequate spacing and visibility
        suggestedMax: Math.max(
          Number(insights.total_income) || 0,
          Number(insights.total_expense) || 0
        ) * 1.2, // Add 20% padding above the highest value
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          padding: 10
        }
      }
    }
  };

  const totalBalance = (insights.total_income || 0) - (insights.total_expense || 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Expense Tracker
          </h1>
        </div>

        {/* Month Selector */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Select Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Label htmlFor="month">Month:</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-auto"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-success">
                    ${(insights.total_income || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-destructive">
                    ${(insights.total_expense || 0).toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className={`stat-card ${totalBalance >= 0 ? 'stat-card-success' : 'stat-card-danger'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Net Balance</p>
                  <p className="text-2xl font-bold">
                    ${Math.abs(totalBalance).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Entry Form */}
        <Card className="glass animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Entry
            </CardTitle>
            <CardDescription>Track your income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={entryType} onValueChange={setEntryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {entryType === "Expense" && (
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wants">Wants</SelectItem>
                      <SelectItem value="Needs">Needs</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Optional"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleAdd} className="w-full gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </CardContent>
          </Card>

          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Income vs Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entries Table */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {entries.length} entries for {(() => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1); // Month is 0-indexed
                return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={entry.entry_type === "Income" ? "default" : "destructive"}>
                          {entry.entry_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.type || "-"}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${entry.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entry.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No entries for this month</p>
                <p className="text-sm">Start by adding your first transaction above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseTracker;