import { FaChartPie, FaWallet, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-between w-64 h-screen p-5 bg-white shadow-md dark:bg-gray-900">
      <div>
        <h1 className="mb-8 text-2xl font-bold text-blue-600">FinPilot</h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-500"
          >
            <FaChartPie /> Dashboard
          </button>

          <button className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <FaWallet /> Transactions
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-600"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;