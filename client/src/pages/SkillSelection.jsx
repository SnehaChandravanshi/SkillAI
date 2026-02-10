import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function SkillSelection() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [customSkill, setCustomSkill] = useState("");
  const [level, setLevel] = useState("beginner");
  const [timeline, setTimeline] = useState(6);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/skills");
        setSkills(res.data);
      } catch (err) {
        console.error("Failed to load skills", err);
      }
    };
    fetchSkills();
  }, []);

  const generateRoadmap = async () => {
    if (!selectedSkill && !customSkill.trim()) {
      alert("Please select or type a skill");
      return;
    }

    const skillName = customSkill.trim() || selectedSkill.name;
    const subSkills = selectedSkill ? selectedSkill.subSkills : [];

    try {
      await api.post("/roadmap/generate", {
        skill: skillName,
        subSkills,
        level,
        timeline,
      });

      // alert("Roadmap generated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to generate roadmap: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8 lg:p-12 container mx-auto max-w-[1600px] flex flex-col justify-center">

        <header className="mb-12 text-center animate-fade-in">
          <h2 className="text-5xl lg:text-7xl font-bold font-heading mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
            What do you want to learn today?
          </h2>
          <p className="text-xl text-slate-400">Select a path or design your own curriculum.</p>
        </header>

        {/* Custom Skill Input - HERO STYLE */}
        <div className="glass-panel p-10 mb-12 border border-indigo-500/30 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-indigo-500/20"></div>

          <label className="block text-3xl font-bold mb-6 text-indigo-200 flex items-center gap-4">
            <span className="text-5xl animate-pulse-glow">✨</span> Create a Custom AI Course
          </label>
          <div className="flex gap-6">
            <input
              type="text"
              placeholder="e.g. Quantum Computing, Advanced Pottery, Rust Programming..."
              className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl px-8 py-6 text-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
              value={customSkill}
              onChange={(e) => {
                setCustomSkill(e.target.value);
                setSelectedSkill(null); // Deselect predefined if typing custom
              }}
            />
          </div>
          <p className="text-lg text-slate-400 mt-4 pl-2">
            Type any topic, and our AI will build a personalized curriculum for you.
          </p>
        </div>

        <div className="flex items-center gap-8 mb-12 opacity-50">
          <div className="h-px bg-slate-700 flex-1"></div>
          <span className="text-slate-400 text-lg font-bold uppercase tracking-widest">OR CHOOSE A PATH</span>
          <div className="h-px bg-slate-700 flex-1"></div>
        </div>

        {/* Skill List - LARGE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {skills.map((skill) => (
            <div
              key={skill._id}
              onClick={() => {
                setSelectedSkill(skill);
                setCustomSkill(""); // Clear custom if selecting predefined
              }}
              className={`glass-panel p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2 group ${selectedSkill?._id === skill._id
                ? "ring-4 ring-indigo-500/50 border-indigo-500 bg-indigo-900/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                : "border-transparent hover:border-slate-600 hover:bg-slate-800/80"
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className={`font-bold text-3xl ${selectedSkill?._id === skill._id ? "text-indigo-300" : "text-slate-100"} group-hover:text-indigo-200 transition-colors`}>
                  {skill.name}
                </h3>
                {selectedSkill?._id === skill._id && <span className="text-2xl text-indigo-400">✓</span>}
              </div>

              <p className="text-lg text-slate-400 line-clamp-3 leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>

        {/* Configuration Panel - WIDER */}
        <div className="glass-panel p-10 shadow-2xl border border-white/5">
          <h3 className="text-2xl font-bold mb-8 text-slate-200 border-b border-white/5 pb-4">Course Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="block text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-4 py-4 rounded-xl text-lg font-bold capitalize transition-all border-2 ${level === lvl
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                      : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4">
                Timeline ({timeline} Weeks)
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full h-4 bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                />
                <div className="flex justify-between text-base text-slate-400 mt-3 font-medium">
                  <span>2 Weeks (Sprint)</span>
                  <span>12 Weeks (Semester)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={generateRoadmap}
            disabled={!selectedSkill && !customSkill}
            className={`w-full mt-12 font-bold text-2xl py-6 rounded-2xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 ${(!selectedSkill && !customSkill)
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-400/20'
              }`}
          >
            {(!selectedSkill && !customSkill) ?
              <span className="flex items-center gap-2">👆 Select or Type a Topic to Begin</span> :
              <span className="flex items-center gap-3">🚀 Generate AI Roadmap</span>
            }
          </button>
        </div>
      </div>
    </>
  );
}
