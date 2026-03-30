import { useState } from "react";
import API from "../services/api";

const AddTransaction = ({ refresh }) => {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/api/transactions", form);

    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
    });

    refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mt-6">
      <h2 className="text-lg font-semibold mb-3">Add Transaction</h2>

      <input
        placeholder="Amount"
        className="border p-2 w-full mb-2"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-2"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Category"
        className="border p-2 w-full mb-2"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="Description"
        className="border p-2 w-full mb-2"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AddTransaction;