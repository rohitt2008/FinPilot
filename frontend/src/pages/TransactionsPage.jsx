import TransactionList from "../components/TransactionList";

const TransactionsPage = () => {
  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Transactions
      </h1>

      <TransactionList />
    </div>
  );
};

export default TransactionsPage;