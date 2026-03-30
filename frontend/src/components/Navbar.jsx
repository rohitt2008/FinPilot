import { FaWallet } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const { dark, setDark } = useContext(ThemeContext);



const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <FaWallet />
        FinPilot
      </div>
      <button onClick={() => setDark(!dark)}>
  {dark ? <FaSun /> : <FaMoon />}
</button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 transition hover:text-red-600"
      >
        <FiLogOut />
        Logout
      </button>
    </div>
  );
};

export default Navbar;