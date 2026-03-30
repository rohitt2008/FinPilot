import { useEffect, useState } from "react";
import API from "../services/api";

const Insights = () => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await API.get("/analytics/smart-insights");

        // ✅ FIX HERE
        setInsights(res.data.insights || []);
      } catch (err) {
        console.error("Insights error:", err);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-3 text-lg font-semibold">Smart Insights</h2>

      {insights.length === 0 ? (
        <p className="text-gray-500">No insights available</p>
      ) : (
        <ul className="space-y-2">
  {insights.map((item, index) => (
    <li
      key={index}
      className="px-3 py-2 text-sm text-blue-700 rounded-md bg-blue-50"
    >
      {item}
    </li>
  ))}
</ul>
      )}
    </div>
  );
};

export default Insights;