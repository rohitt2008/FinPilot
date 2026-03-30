import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";


const Dashboard = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setIsLoading(true);
        const res = await API.get("/api/analytics");
        setData({
          totalIncome: res.data?.totalIncome ?? 0,
          totalExpense: res.data?.totalExpense ?? 0,
          balance: res.data?.balance ?? 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <>

    <Navbar />
    <AddTransaction refresh={() => window.location.reload()} />
    <TransactionList />
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="mb-8 text-sm text-slate-500">Your finance overview at a glance</p>

        {error && (
          <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-slate-500 shadow">Loading analytics...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-slate-500">Total Income</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(data.totalIncome)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-sm font-medium text-slate-500">Total Expense</p>
              <p className="mt-2 text-2xl font-bold text-rose-600">
                {formatCurrency(data.totalExpense)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md sm:col-span-2 lg:col-span-1">
              <p className="text-sm font-medium text-slate-500">Balance</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">{formatCurrency(data.balance)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
    
  );
};

export default Dashboard;