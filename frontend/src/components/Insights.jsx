import { useEffect, useState } from "react";
import API from "../services/api";

// Assign an icon + color scheme based on keywords in the insight text
const getInsightStyle = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("saving") || t.includes("saved") || t.includes("good"))
    return { icon: "🎯", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", text: "text-emerald-700 dark:text-emerald-300" };
  if (t.includes("spend") || t.includes("high") || t.includes("exceed") || t.includes("over"))
    return { icon: "⚠️", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20", text: "text-red-700 dark:text-red-300" };
  if (t.includes("income") || t.includes("earn") || t.includes("salary"))
    return { icon: "💼", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-200 dark:border-indigo-500/20", text: "text-indigo-700 dark:text-indigo-300" };
  if (t.includes("food") || t.includes("dining"))
    return { icon: "🍜", bg: "bg-orange-50 dark:bg-orange-500/10", border: "border-orange-200 dark:border-orange-500/20", text: "text-orange-700 dark:text-orange-300" };
  if (t.includes("transport") || t.includes("travel"))
    return { icon: "🚗", bg: "bg-sky-50 dark:bg-sky-500/10", border: "border-sky-200 dark:border-sky-500/20", text: "text-sky-700 dark:text-sky-300" };
  if (t.includes("bill") || t.includes("utilit"))
    return { icon: "📄", bg: "bg-yellow-50 dark:bg-yellow-500/10", border: "border-yellow-200 dark:border-yellow-500/20", text: "text-yellow-700 dark:text-yellow-300" };
  // default
  return { icon: "💡", bg: "bg-slate-50 dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700", text: "text-slate-700 dark:text-slate-300" };
};

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/analytics/smart-insights");
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error("Insights error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="p-6 space-y-4 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl border-slate-200 dark:border-slate-800">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            AI-Powered
          </p>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Smart Insights
          </h2>
        </div>
        <div className="flex items-center justify-center text-lg w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
          ✨
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="flex-1 pt-1 space-y-2">
                <div className="w-full h-3 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="w-3/4 h-3 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 text-3xl">🔍</div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No insights yet</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Add more transactions to unlock smart insights.
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {insights.map((item, index) => {
            const style = getInsightStyle(item);
            return (
              <li
                key={index}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium leading-relaxed
                  ${style.bg} ${style.border} ${style.text} transition-all duration-150 hover:-translate-y-px hover:shadow-sm`}
              >
                <span className="flex-shrink-0 mt-px text-base">{style.icon}</span>
                <span>{item}</span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer */}
      {!loading && insights.length > 0 && (
        <p className="pt-1 text-xs text-center text-slate-400 dark:text-slate-600">
          Based on your recent transaction history
        </p>
      )}

    </div>
  );
};

export default Insights;
