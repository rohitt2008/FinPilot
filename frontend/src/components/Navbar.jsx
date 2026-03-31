import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/add", label: "Add Transaction" },
  { to: "/transactions", label: "Transactions" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, setDark } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/90 border-slate-200 dark:bg-slate-950/90 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-[62px] flex items-center justify-between">

        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-mono text-xs font-semibold text-white rounded-lg shadow-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/30">
            fp
          </div>
          <span className="text-[1.05rem] font-bold tracking-tight text-slate-900 dark:text-slate-100">
            FinPilot
          </span>
        </Link>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-1 p-0 m-0 list-none">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium tracking-tight no-underline transition-all duration-150
                    ${isActive
                      ? "text-indigo-600 bg-indigo-50 font-semibold dark:text-indigo-400 dark:bg-indigo-500/15"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/6"
                    }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-indigo-500 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">

          {/* THEME TOGGLE */}
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-[9px] transition-all duration-150 hover:scale-105
              bg-slate-100 text-indigo-500 hover:bg-slate-200
              dark:bg-white/[0.07] dark:text-amber-400 dark:hover:bg-white/[0.12]"
          >
            {dark ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>

          {/* DIVIDER */}
          <div className="w-px h-5 mx-1 bg-slate-200 dark:bg-white/10" />

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-xs font-semibold border transition-all duration-150
              hover:-translate-y-px hover:shadow-md hover:shadow-red-500/20
              text-red-600 bg-red-50 border-red-200 hover:bg-red-100
              dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 dark:hover:bg-red-500/20"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
