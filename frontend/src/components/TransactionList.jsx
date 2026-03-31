import { useEffect, useState } from "react";
import API from "../services/api";

const CATEGORY_ICONS = {
  food: "🍜", transport: "🚗", shopping: "🛍️",
  bills: "📄", salary: "💼", other: "✏️",
};

const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Bills", "Salary", "Other"];

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const TransactionList = ({ refresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({ type: "", category: "" });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set("type", filters.type);
      if (filters.category) params.set("category", filters.category);
      const res = await API.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.transactions || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters.type, filters.category]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const hasActiveFilter = filters.type || filters.category;

  const clearFilters = () => setFilters({ type: "", category: "" });

  return (
    <div className="min-h-screen px-4 py-10 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-widest text-indigo-500 uppercase dark:text-indigo-400">Finance</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h1>
          </div>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-700
                hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500/40
                transition-all duration-150"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="p-4 space-y-3 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">

          {/* Type toggle */}
          <div className="flex items-center gap-2">
            <p className="flex-shrink-0 w-16 text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">Type</p>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {[
                { val: "", label: "All" },
                { val: "income", label: "↓ Income" },
                { val: "expense", label: "↑ Expense" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setFilters({ ...filters, type: val })}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150
                    ${filters.type === val
                      ? val === "income"
                        ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : val === "expense"
                          ? "bg-white dark:bg-slate-700 text-red-500 dark:text-red-400 shadow-sm"
                          : "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex items-start gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 w-16 flex-shrink-0 pt-1.5">
              Category
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const val = cat === "All" ? "" : cat.toLowerCase();
                const active = filters.category === val;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: val })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
                      ${active
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                      }`}
                  >
                    {cat === "All" ? cat : `${CATEGORY_ICONS[cat.toLowerCase()] || ""} ${cat}`}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── List Card ── */}
        <div className="overflow-hidden bg-white border shadow-xl dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none">

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {loading ? "Loading..." : `${transactions.length} transaction${transactions.length !== 1 ? "s" : ""}`}
              </p>
              {hasActiveFilter && !loading && (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 capitalize">
                  Filtered by: {[filters.type, filters.category].filter(Boolean).join(", ")}
                </p>
              )}
            </div>

            {/* Summary pills */}
            {!loading && transactions.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  +₹{totalIncome.toLocaleString()}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400">
                  -₹{totalExpense.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex flex-col gap-3 p-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-3 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-4 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-3 text-4xl">🪹</div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No transactions found</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {hasActiveFilter ? "No results for this filter. Try clearing it." : "Add one to get started."}
              </p>
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {transactions.map((t) => {
                const icon = CATEGORY_ICONS[t.category?.toLowerCase()] || "💳";
                const isIncome = t.type === "income";
                return (
                  <li
                    key={t._id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-100 group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                      ${isIncome ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-red-50 dark:bg-red-500/10"}`}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold capitalize truncate text-slate-800 dark:text-slate-100">{t.category}</p>
                      <p className="text-xs truncate text-slate-400 dark:text-slate-500">
                        {t.description || formatDate(t.createdAt) || "No description"}
                      </p>
                    </div>
                    <div className="flex items-center flex-shrink-0 gap-3">
                      <span className={`text-sm font-bold tabular-nums ${isIncome ? "text-emerald-500" : "text-red-500"}`}>
                        {isIncome ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        disabled={deletingId === t._id}
                        className="flex items-center justify-center transition-all duration-150 rounded-lg opacity-0 w-7 h-7 group-hover:opacity-100 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40"
                        aria-label="Delete transaction"
                      >
                        {deletingId === t._id ? (
                          <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default TransactionList;
