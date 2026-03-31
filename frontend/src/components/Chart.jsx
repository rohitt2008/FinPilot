import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(v || 0);

const COLORS = [
  "#22c55e", "#ef4444", "#3b82f6",
  "#f59e0b", "#a855f7", "#14b8a6",
];

const Chart = ({ income = 0, expense = 0, transactions = [], type = "overview" }) => {

  let labels = [];
  let values = [];
  let colors = [];

  // 🔥 CATEGORY MODE
  if (type === "category") {
    const map = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "other";
        map[cat] = (map[cat] || 0) + t.amount;
      });

    labels = Object.keys(map);
    values = Object.values(map);
    colors = COLORS.slice(0, labels.length);

  } else {
    labels = ["Income", "Expense"];
    values = [income, expense];
    colors = ["#22c55e", "#ef4444"];
  }

  const total = values.reduce((a, b) => a + b, 0);

  const incomePercent =
    total > 0 ? Math.round((income / total) * 100) : 0;

  const expensePercent =
    total > 0 ? Math.round((expense / total) * 100) : 0;

  const balance = income - expense;
  const isPositive = balance >= 0;

  const data = {
    labels,
    datasets: [
      {
        data: total > 0 ? values : [1],
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${fmt(ctx.raw)}`,
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-5 bg-white border shadow-sm dark:bg-slate-900 rounded-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {type === "category" ? "Expense Breakdown" : "Spending Overview"}
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {fmt(total)}
            <span className="text-xs ml-1.5 text-slate-400">total</span>
          </p>
        </div>

        {type === "overview" && (
          <span className={`text-xs px-2.5 py-1 rounded-full
            ${isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"}`}>
            {isPositive ? "+" : ""}{fmt(balance)} net
          </span>
        )}
      </div>

      {/* DONUT */}
      <div className="flex justify-center">
  <div className="relative w-44 h-44">

    {/* Chart */}
    <Pie data={data} options={options} />

    {/* Center Label */}
    <div className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">

      {type === "overview" ? (
        <>
          <p className="text-[11px] uppercase text-slate-400">Saved</p>
          <p className={`text-xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? incomePercent - expensePercent : 0}%
          </p>
        </>
      ) : (
        <>
          <p className="text-[11px] uppercase text-slate-400">Top</p>
          <p className="text-sm font-bold capitalize text-slate-700 dark:text-white">
            {labels[values.indexOf(Math.max(...values))] || "-"}
          </p>
        </>
      )}

    </div>

  </div>
</div>

        

      {/* LEGEND */}
      {/* LEGEND (SAME DESIGN FOR BOTH) */}
<div className="space-y-2.5">

  {labels.map((label, i) => {
    const percent =
      total > 0 ? Math.round((values[i] / total) * 100) : 0;

    return (
      <div key={label} className="flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors[i] }}
          />
          <span className="text-sm font-medium capitalize text-slate-600 dark:text-slate-300">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${percent}%`,
                backgroundColor: colors[i],
              }}
            />
          </div>

          {/* Amount */}
          <span className="w-20 text-sm font-bold text-right tabular-nums">
            {fmt(values[i])}
          </span>
        </div>

      </div>
    );
  })}

</div>

      {/* FOOTER */}
      {type === "overview" && (
        <div className="flex justify-between pt-1 text-sm border-t">
          <span>Net balance</span>
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {fmt(balance)}
          </span>
        </div>
      )}

    </div>
  );
};

export default Chart;