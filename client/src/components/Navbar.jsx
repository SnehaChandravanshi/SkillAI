import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-700/50 px-4 sm:px-8 py-4 sm:py-6 flex flex-wrap justify-between items-center gap-4 shadow-2xl transition-all duration-300">
      <Link to="/dashboard" className="text-3xl sm:text-4xl font-bold font-heading bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity tracking-tight">
        SkillAI
      </Link>

      <div className="flex flex-wrap gap-2 sm:gap-8 items-center justify-center w-full sm:w-auto">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/skills">Skills</NavLink>
        <NavLink to="/roadmap">Roadmap</NavLink>
        <NavLink to="/profile">Profile</NavLink>

        <button
          onClick={logout}
          className="ml-2 sm:ml-6 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 border border-slate-700 px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-base sm:text-lg font-bold transition-all duration-200 shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-slate-300 text-base sm:text-xl font-bold hover:text-white hover:bg-white/5 px-2 py-1.5 sm:px-4 sm:py-3 rounded-lg transition-all duration-200"
    >
      {children}
    </Link>
  );
}
