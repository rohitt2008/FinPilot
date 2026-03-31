import { Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { dark, setDark } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-gray-900">
      
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-blue-600">FinPilot</h1>

        <Link to="/dashboard" className="text-gray-700 dark:text-white hover:text-blue-500">
          Dashboard
        </Link>

        <Link to="/add" className="text-gray-700 dark:text-white hover:text-blue-500">
          Add Transaction
        </Link>

        <Link to="/transactions" className="text-gray-700 dark:text-white hover:text-blue-500">
          Transactions
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* DARK MODE */}
        <button onClick={() => setDark(!dark)}>
          {dark ? (
            <FaSun className="text-lg text-yellow-400" />
          ) : (
            <FaMoon className="text-lg text-gray-700" />
          )}
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;