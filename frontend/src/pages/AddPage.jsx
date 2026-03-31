import AddTransaction from "../components/AddTransaction";

const AddPage = () => {
  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Add Transaction
      </h1>

      <AddTransaction />
    </div>
  );
};

export default AddPage;