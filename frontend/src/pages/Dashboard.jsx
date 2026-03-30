import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await API.get("/analytics");
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {data && (
        <>
          <p>Income: {data.totalIncome}</p>
          <p>Expense: {data.totalExpense}</p>
          <p>Balance: {data.balance}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;