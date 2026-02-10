import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Roadmap() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================
     FETCH ROADMAP + PROGRESS
  ========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const roadmapRes = await api.get("/roadmap/my");
        // Handle array response (backend now returns all roadmaps)
        const apps = Array.isArray(roadmapRes.data)
          ? roadmapRes.data
          : [roadmapRes.data];

        let activeRoadmap = apps[0];
        if (id) {
          const found = apps.find(r => r._id === id);
          if (found) activeRoadmap = found;
        }

        setRoadmap(activeRoadmap);

        if (activeRoadmap?._id) {
          const progressRes = await api.get(
            `/progress/${activeRoadmap._id}`
          );
          setProgress(progressRes.data);
        }
      } catch (err) {
        console.error("Roadmap fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* =========================
     OPEN MODULE
  ========================== */
  const openModule = async (topic) => {
    try {
      const res = await api.post("/modules/generate", {
        roadmapId: roadmap._id,
        topic,
        level: "beginner",
      });

      navigate(`/modules/${res.data._id}`);
    } catch (err) {
      alert("Failed to open module");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">Loading roadmap...</div>
      </>
    );
  }

  if (!roadmap) {
    return (
      <>
        <Navbar />
        <div className="p-6">
          <p>No roadmap found. Please generate one first.</p>
        </div>
      </>
    );
  }

  /* =========================
     CALCULATE COMPLETION %
  ========================== */
  // 1. Get total distinct modules in the roadmap
  const totalModulesCount = roadmap.weeklyPlan.reduce(
    (sum, week) => sum + week.modules.length,
    0
  );

  // 2. Get distinct completed titles
  // "progress.completedModules" is now an array of populated objects (thanks to backend update)
  const completedTitles = new Set(
    progress?.completedModules?.map((m) => m.title || m) || []
  );

  // 3. Count how many roadmap modules are in the completed set
  // This prevents counting duplicates or modules not in this roadmap
  let completedCount = 0;
  roadmap.weeklyPlan.forEach((week) => {
    week.modules.forEach((modTitle) => {
      if (completedTitles.has(modTitle)) {
        completedCount++;
      }
    });
  });

  const completionPercent =
    totalModulesCount > 0
      ? Math.min(100, Math.round((completedCount / totalModulesCount) * 100))
      : 0;

  const downloadCertificate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || { name: "Learner", email: "learner@example.com" };

      const res = await api.post(
        "/certificate/generate",
        {
          user,
          roadmap,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${roadmap.skill}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to generate certificate.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8 lg:p-12 container mx-auto max-w-[1600px]">
        <header className="mb-16 text-center animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-bold font-heading mb-6 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Your Learning Journey
          </h1>
          <div className="max-w-4xl mx-auto glass-panel p-8 flex flex-col items-center shadow-2xl border border-white/5">
            <div className="w-full flex justify-between text-lg text-slate-300 mb-3 font-bold uppercase tracking-widest">
              <span>Course Progress</span>
              <span className="text-2xl text-emerald-400">{completionPercent}%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-6 mb-6 overflow-hidden border border-slate-600/50">
              <div
                className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-6 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-1000 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="text-slate-400 text-xl font-medium">
              <span className="text-white font-bold">{completedCount}</span> of <span className="text-white font-bold">{totalModulesCount}</span> modules completed
            </p>

            {/* Certificate Button */}
            {completionPercent === 100 && (
              <div className="mt-4 animate-slide-up">
                <button
                  onClick={downloadCertificate}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-purple-900/40 transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                  <span>🎓</span> Download Certificate
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="max-w-6xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-6 lg:left-10 top-0 bottom-0 w-1 bg-slate-700/30"></div>

          <div className="space-y-8">
            {roadmap.weeklyPlan.map((week, weekIndex) => (
              <div
                key={week.week}
                className="relative pl-12 lg:pl-20 animate-slide-up"
                style={{ animationDelay: `${weekIndex * 0.1}s` }}
              >
                <div className="absolute left-0 lg:left-4 top-0 w-14 h-14 rounded-full bg-slate-900 border-4 border-indigo-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                  <span className="text-xl font-bold text-indigo-300">{week.week}</span>
                </div>

                <div className="glass-card p-8 border-l-8 border-l-indigo-500 shadow-xl group">
                  <h2 className="text-3xl font-bold font-heading mb-6 text-white">
                    Week {week.week}: <span className="text-indigo-300">{week.focus}</span>
                  </h2>

                  <ul className="space-y-4">
                    {week.modules.map((moduleTitle, i) => {
                      const isCompleted = completedTitles.has(moduleTitle);

                      return (
                        <li
                          key={i}
                          onClick={() => openModule(moduleTitle)}
                          className={`group flex items-center gap-5 p-5 rounded-2xl transition-all cursor-pointer border-2 ${isCompleted
                            ? "bg-emerald-900/10 border-emerald-500/20"
                            : "bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-indigo-500/50 hover:shadow-lg"
                            }`}
                        >
                          <div className={`p-3 rounded-full ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                            {isCompleted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>

                          <span className={`font-bold text-xl ${isCompleted ? "text-slate-500 line-through decoration-slate-600 decoration-2" : "text-slate-200 group-hover:text-white"}`}>
                            {moduleTitle}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
