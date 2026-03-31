import { useState } from "react";
import API from "../services/api";

const AddTransaction = ({ refresh }) => {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    description: "",
  });

  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      category === "other" ? customCategory.trim() : category;

    if (!form.amount || !finalCategory) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/transactions", {
        amount: Number(form.amount),
        type: form.type,
        category: finalCategory,
        description: form.description,
      });

      // Reset form
      setForm({
        amount: "",
        type: "expense",
        description: "",
      });
      setCategory("");
      setCustomCategory("");

      // Refresh parent
      if (refresh) refresh();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 mt-6 bg-white shadow dark:bg-gray-900 rounded-xl"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Add Transaction
      </h2>

      {/* AMOUNT */}
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      {/* TYPE */}
      <select
        className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      {/* CATEGORY DROPDOWN */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="shopping">Shopping</option>
        <option value="bills">Bills</option>
        <option value="salary">Salary</option>
        <option value="other">Other</option>
      </select>

      {/* CUSTOM CATEGORY */}
      {category === "other" && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          className="w-full p-2 mb-3 border rounded dark:bg-gray-800 dark:text-white"
        />
      )}

      {/* DESCRIPTION */}
      <input
        placeholder="Description (optional)"
        className="w-full p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      {/* BUTTON */}
      <button className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransaction;