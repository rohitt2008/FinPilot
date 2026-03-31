import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

import Chart from "../components/Chart";
import Insights from "../components/Insights";
import { ThemeContext } from "../context/ThemeContext";


const CATEGORY_ICONS = {
  food: "🍜",
  transport: "🚗",
  shopping: "🛍️",
  bills: "📄",
  salary: "💼",
  other: "✏️",
};

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v || 0);

// ── Stat Card ──
const StatCard = ({ label, value, icon, color }) => (
  <div className="p-5 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">
    <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${color}`}>
      {icon}
    </div>
    <p className="mt-3 text-xs uppercase text-slate-400">{label}</p>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

// ── Recent Activity ──
const RecentActivity = ({ transactions = [], loading }) => (
  <div className="bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">
    <div className="flex justify-between px-5 py-4 border-b dark:border-slate-800">
      <h3 className="text-sm font-bold dark:text-white">Recent Activity</h3>
      <Link to="/transactions" className="text-xs text-indigo-500">
        View all →
      </Link>
    </div>

    {loading ? (
      <p className="p-5 text-sm">Loading...</p>
    ) : transactions.length === 0 ? (
      <p className="p-5 text-sm text-gray-500">No transactions</p>
    ) : (
      <ul>
        {transactions.map((t) => {
          const isIncome = t.type === "income";
          const icon = CATEGORY_ICONS[t.category?.toLowerCase()] || "💳";

          return (
            <li key={t._id} className="flex items-center justify-between px-5 py-3 border-b dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span>{icon}</span>
                <div>
                  <p className="text-sm font-semibold capitalize dark:text-white">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.description}</p>
                </div>
              </div>

              <span className={isIncome ? "text-green-500" : "text-red-500"}>
                {isIncome ? "+" : "-"}₹{t.amount}
              </span>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

// ── Dashboard ──
const Dashboard = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    alert: null,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

  const { dark } = useContext(ThemeContext);

  // 🔥 FETCH ANALYTICS
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/analytics");

      setData({
        totalIncome: res.data?.totalIncome || 0,
        totalExpense: res.data?.totalExpense || 0,
        balance: res.data?.balance || 0,
        alert: res.data?.alert || null,
      });
    } catch (err) {
      console.error("Analytics error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 FETCH TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      setTxLoading(true);

      const res = await API.get("/transactions?limit=1000");
      const all = res.data.transactions || res.data;

      setAllTransactions(all);       // for chart
      setRecentTransactions(all.slice(0, 5)); // for UI

    } catch (err) {
      console.error("Transaction error");
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  // 🔥 EXPORT CSV
  const handleExport = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/transactions/export", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const savingsRate =
    data.totalIncome > 0
      ? Math.round(
          ((data.totalIncome - data.totalExpense) / data.totalIncome) * 100
        )
      : 0;

  return (
    <div className="min-h-screen p-6 space-y-6 bg-slate-50 dark:bg-slate-950">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>

        <div className="flex gap-3">
          <Link to="/add" className="px-4 py-2 text-white bg-indigo-600 rounded-lg">
            Add Transaction
          </Link>

          <button onClick={handleExport} className="px-4 py-2 bg-gray-200 rounded-lg">
            Export CSV
          </button>
        </div>
      </div>

      {/* ALERT */}
      {data.alert && (
        <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
          ⚠️ {data.alert.message} (₹{data.alert.exceededBy})
        </div>
      )}

      {/* LOADING */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* CARDS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatCard label="Income" value={fmt(data.totalIncome)} icon="💰" color="bg-green-100" />
            <StatCard label="Expense" value={fmt(data.totalExpense)} icon="💸" color="bg-red-100" />
            <StatCard label="Balance" value={fmt(data.balance)} icon="⚖️" color="bg-blue-100" />
            <StatCard label="Savings %" value={`${savingsRate}%`} icon="📊" color="bg-yellow-100" />
          </div>

          {/* CHART + INSIGHTS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            
            <Chart
    income={data.totalIncome}
    expense={data.totalExpense}
    type="overview"
  />

  <Chart
    transactions={allTransactions}
    type="category"
  />
            <Insights />
            
        {/* RECENT */}
          <RecentActivity
            transactions={recentTransactions}
            loading={txLoading}
          />
          </div>

          
        </>
      )}
    </div>
  );
};

export default Dashboard;