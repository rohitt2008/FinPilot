import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ income, expense }) => {
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-4 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-3 text-lg font-semibold">Overview</h2>
      <Pie data={data} />
    </div>
  );
};

export default Chart;