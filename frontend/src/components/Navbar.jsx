import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <h1 className="text-xl font-bold text-blue-600">FinPilot</h1>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;