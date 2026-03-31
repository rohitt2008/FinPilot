import { useEffect, useState } from "react";
import API from "../services/api";

import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";
import Chart from "../components/Chart";
import Insights from "../components/Insights";

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";


const Dashboard = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    alert: null,
  });
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [filters, setFilters] = useState({
    type: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { dark, setDark } = useContext(ThemeContext);

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
      setError("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const handleExport = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3000/api/transactions/export",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="flex">

      

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen p-6 transition-all duration-300 bg-slate-50 dark:bg-gray-800">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-300">
              Your finance overview
            </p>
          </div>

          <div className="flex items-center gap-4">

            

            {/* EXPORT */}
            <button
              onClick={handleExport}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* ALERT */}
        {data?.alert && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
            ⚠️ {data.alert?.message} (₹{data.alert?.exceededBy})
          </div>
        )}

        {/* FILTERS */}
        <div className="flex gap-4 mb-6">
          <select
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="shopping">Shopping</option>
        <option value="bills">Bills</option>
        <option value="salary">Salary</option>
        <option value="other">Other</option>
      </select>

      {/* CUSTOM CATEGORY */}
      {category === "other" && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
        />
      )}
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="p-6 bg-white rounded shadow">Loading...</div>
        ) : (
          <>
            {/* CARDS */}
            <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">

              <div className="p-6 text-white transition shadow bg-gradient-to-r from-green-400 to-green-600 rounded-xl hover:scale-105">
                <p>Income</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalIncome)}
                </p>
              </div>

              <div className="p-6 text-white transition shadow bg-gradient-to-r from-red-400 to-red-600 rounded-xl hover:scale-105">
                <p>Expense</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.totalExpense)}
                </p>
              </div>

              <div className="p-6 text-white transition shadow bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl hover:scale-105">
                <p>Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.balance)}
                </p>
              </div>

            </div>

            {/* CHART + INSIGHTS */}
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
              <Chart
                income={data?.totalIncome || 0}
                expense={data?.totalExpense || 0}
              />
              <Insights />
            </div>

            

          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;