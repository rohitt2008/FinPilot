import { useEffect, useState } from "react";
import API from "../services/api";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get("/api/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/api/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-3">Transactions</h2>

      {transactions.map((t) => (
        <div key={t._id} className="flex justify-between border-b py-2">
          <span>{t.category} - ₹{t.amount}</span>
          <button
            onClick={() => handleDelete(t._id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;