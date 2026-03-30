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

    await API.post("/transactions", form);
    refresh();

    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
    });

    refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mt-6 bg-white shadow rounded-xl">
      <h2 className="mb-3 text-lg font-semibold">Add Transaction</h2>

      <input
        placeholder="Amount"
        className="w-full p-2 mb-2 border"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <select
        className="w-full p-2 mb-2 border"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Category"
        className="w-full p-2 mb-2 border"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="Description"
        className="w-full p-2 mb-2 border"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
  Add Transaction
</button>
    </form>
  );
};

export default AddTransaction;