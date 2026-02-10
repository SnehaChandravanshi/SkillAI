import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="glass-panel w-full max-w-lg p-10 relative z-10 animate-slide-up backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg shadow-sky-500/30 animate-float">
            ✨
          </div>
          <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3">
            Join SkillAI
          </h1>
          <p className="text-slate-400 text-base">
            Start mastering new skills today
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-base flex items-center gap-3 animate-fade-in">
            <span className="text-xl">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider mb-2.5 ml-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-4 pl-12 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all group-hover:border-slate-600"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <span className="absolute left-4 top-4 text-slate-500 text-xl">👤</span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider mb-2.5 ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-4 pl-12 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all group-hover:border-slate-600"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <span className="absolute left-4 top-4 text-slate-500 text-xl">✉️</span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider mb-2.5 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-4 pl-12 text-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all group-hover:border-slate-600"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <span className="absolute left-4 top-4 text-slate-500 text-xl">🔒</span>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg font-bold py-5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-3">
            <span>Create Account</span>
            <span className="opacity-70 text-xl">→</span>
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-base">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
