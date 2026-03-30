import { useEffect, useState } from "react";
import API from "../services/api";

const TransactionList = ({refresh}) => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get(`/transactions?${new URLSearchParams(filters)}`);
    setTransactions(res.data.transactions || res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
    refresh();
  };

  return (
  <div className="p-4 mt-6 bg-white shadow rounded-xl">
    <h2 className="mb-3 text-lg font-semibold">Transactions</h2>

    {transactions.length === 0 ? (
      <p className="text-gray-500">No transactions yet</p>
    ) : (
      transactions.map((t) => (
        <div
          key={t._id}
          className="flex items-center justify-between px-2 py-3 transition border-b rounded hover:bg-gray-50"
        >
          <div>
            <p className="font-medium">{t.category}</p>
            <p className="text-sm text-gray-500">{t.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`font-bold ${
                t.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{t.amount}
            </span>

            <button
              onClick={() => handleDelete(t._id)}
              className="text-red-400 transition hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);
};

export default TransactionList;