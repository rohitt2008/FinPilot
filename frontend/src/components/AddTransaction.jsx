import { useState } from "react";
import API from "../services/api";

const CATEGORIES = [
  { value: "food", label: "🍜 Food & Dining" },
  { value: "transport", label: "🚗 Transport" },
  { value: "shopping", label: "🛍️ Shopping" },
  { value: "bills", label: "📄 Bills & Utilities" },
  { value: "salary", label: "💼 Salary" },
  { value: "other", label: "✏️ Other" },
];

const AddTransaction = ({ refresh }) => {
  const [form, setForm] = useState({ amount: "", type: "expense", description: "" });
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = category === "other" ? customCategory.trim() : category;

    if (!form.amount || !finalCategory) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/transactions", {
        amount: Number(form.amount),
        type: form.type,
        category: finalCategory,
        description: form.description,
      });

      setForm({ amount: "", type: "expense", description: "" });
      setCategory("");
      setCustomCategory("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      if (refresh) refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const isExpense = form.type === "expense";

  return (
    <div className="flex items-start justify-center min-h-screen px-4 pt-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-semibold tracking-widest text-indigo-500 uppercase dark:text-indigo-400">
            Finance Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            New Transaction
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Log an income or expense to your account.
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden bg-white border shadow-xl dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800 shadow-slate-200/60 dark:shadow-none">

          {/* Type Toggle */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-3.5 text-sm font-semibold tracking-tight transition-all duration-150 capitalize
                  ${form.type === t
                    ? t === "expense"
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-b-2 border-red-500"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-b-2 border-emerald-500"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
              >
                {t === "expense" ? "↑ Expense" : "↓ Income"}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">

            {/* Amount */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-semibold tracking-tight transition-all duration-150 outline-none
                    bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
                    focus:ring-2 focus:bg-white dark:focus:bg-slate-800
                    ${isExpense
                      ? "border-slate-200 dark:border-slate-700 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-500/10"
                      : "border-slate-200 dark:border-slate-700 focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-500/10"
                    }`}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium
                  bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800
                  transition-all duration-150"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Custom Category */}
            {category === "other" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Custom Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gym, Freelance..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium
                    bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
                    focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800
                    transition-all duration-150"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Description <span className="font-normal normal-case text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="Add a note..."
                className="w-full px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium
                  bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800
                  transition-all duration-150"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-tight text-white transition-all duration-200 mt-2
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]
                ${success
                  ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                  : isExpense
                    ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-px"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-px"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : success ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Transaction Added!
                </span>
              ) : (
                `Add ${isExpense ? "Expense" : "Income"} →`
              )}
            </button>

          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-600">
          All transactions are saved to your account instantly.
        </p>

      </div>
    </div>
  );
};

export default AddTransaction;
