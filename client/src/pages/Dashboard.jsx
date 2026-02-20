import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH DATA
  ========================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch All Roadmaps
        const res = await api.get("/roadmap/my");
        // Ensure we handle both array and potential single object fallback
        const apps = Array.isArray(res.data) ? res.data : [res.data];
        setRoadmaps(apps);

        // 2. Fetch Progress for each roadmap
        const progMap = {};
        await Promise.all(
          apps.map(async (rm) => {
            if (rm?._id) {
              try {
                const pRes = await api.get(`/progress/${rm._id}`);
                progMap[rm._id] = pRes.data;
              } catch (e) {
                console.error(`Failed to load progress for ${rm._id}`, e);
              }
            }
          })
        );
        setProgressMap(progMap);
      } catch (err) {
        console.error("Dashboard data error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* =========================
     AI MENTOR CHAT
  ========================== */
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setChat([]);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { role: "user", text: message }]);
    setMessage("");
    setLoading(true);

    try {
      // Default to the first (latest) roadmap for context
      const activeRoadmap = roadmaps[0] || null;
      const activeProgress = activeRoadmap ? progressMap[activeRoadmap._id] : null;

      const res = await api.post("/mentor/chat", {
        message,
        history: chat, // Send conversation history
        roadmap: activeRoadmap,
        progress: activeProgress,
      });

      setChat((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: "Mentor is unavailable right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HELPER: Stats Calculation
  ========================== */
  const getStats = (rm) => {
    if (!rm) return { total: 0, completed: 0, percent: 0, streak: 0 };
    const prog = progressMap[rm._id];

    const total =
      rm.weeklyPlan?.reduce((sum, w) => sum + w.modules.length, 0) || 0;

    // Fix for >100% issue: Count distinct titles that are actually in this roadmap
    const completedTitles = new Set(
      prog?.completedModules?.map((m) => m.title || m) || []
    );

    let completed = 0;
    if (rm.weeklyPlan) {
      rm.weeklyPlan.forEach(week => {
        week.modules.forEach(modTitle => {
          if (completedTitles.has(modTitle)) completed++;
        });
      });
    }

    const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    const streak = prog?.streak || 0;

    return { total, completed, percent, streak };
  };

  /* =========================
     HELPER: Certificate Download
  ========================== */
  const downloadCertificate = async (rm) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || { name: "Learner", email: "learner@example.com" };

      const res = await api.post(
        "/certificate/generate",
        {
          user,
          roadmap: rm,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${rm.skill}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to generate certificate.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen p-8 lg:p-12 container mx-auto max-w-[1800px]">

        {/* Welcome Section - HERO */}
        <header className="mb-12 lg:mb-16 animate-fade-in relative">
          <div className="absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-indigo-500/20 rounded-full blur-[80px] lg:blur-[120px] -z-10 mix-blend-screen animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 lg:w-72 lg:h-72 bg-purple-500/20 rounded-full blur-[60px] lg:blur-[100px] -z-10 mix-blend-screen"></div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-heading mb-4 lg:mb-6 tracking-tight flex items-center flex-wrap gap-4">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Hello, Learner</span>
            <span className="text-4xl md:text-6xl lg:text-8xl">🚀</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-2xl lg:text-3xl font-light max-w-4xl leading-relaxed">
            Ready to push your limits? Your personal AI mentor is standing by to guide your next breakthrough.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* =====================
              LEFT: PROGRESS LIST (Span 8 - WIDER)
          ====================== */}
          <div className="lg:col-span-12 xl:col-span-8 lg:h-[calc(100vh-180px)] lg:overflow-y-auto pr-0 lg:pr-6 space-y-8 animate-slide-up scrollbar-hide" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sticky top-0 bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl z-20 border border-white/10 shadow-2xl supports-[backdrop-filter]:bg-slate-900/40">
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading flex items-center gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl filter drop-shadow-lg">📚</span> Your Paths
              </h2>
              <Link to="/skills" className="w-full sm:w-auto text-center sm:text-left text-sm sm:text-lg font-bold bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white px-6 py-3 rounded-2xl transition-all border border-indigo-500/30 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
                <span>+</span> New Path
              </Link>
            </div>

            {roadmaps.length === 0 && !loading && (
              <div className="glass-panel p-8 text-center text-slate-400 flex flex-col items-center justify-center h-64 border-dashed border-2 border-slate-800">
                <div className="text-4xl mb-4 opacity-50">🌱</div>
                <p>No active courses yet.</p>
                <Link to="/skills" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block font-medium">Start your journey &rarr;</Link>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 pb-20">
              {Object.values(
                roadmaps.reduce((acc, rm) => {
                  const key = `${rm.skill}-${rm.level}`;
                  const stats = getStats(rm);

                  if (!acc[key]) {
                    acc[key] = { ...rm, stats };
                  } else {
                    if (stats.percent > acc[key].stats.percent) {
                      acc[key] = { ...rm, stats };
                    }
                  }
                  return acc;
                }, {})
              )
                .filter((rm) => rm.skill && rm.skill !== "N/A")
                .map((rm) => {
                  const { total, completed, percent, streak } = rm.stats || getStats(rm);

                  // Dynamic background style based on skill name hash or simply alternating
                  const isTech = rm.isCoding !== false; // defaulted to true if undefined

                  return (
                    <div
                      key={rm._id}
                      className="glass-card p-10 relative group overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/20 rounded-3xl"
                    >
                      {/* Background Glow - Intensified */}
                      <div className={`absolute top-0 right-0 -mr-32 -mt-32 w-80 h-80 rounded-full blur-[100px] opacity-30 transition-all duration-500 group-hover:scale-110 ${isTech ? 'bg-cyan-600' : 'bg-rose-600'}`}></div>
                      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-56 h-56 bg-indigo-600/20 rounded-full blur-[80px] opacity-30"></div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
                          <div className="flex-1">
                            <h3 className="text-2xl lg:text-4xl font-black font-heading text-white group-hover:text-indigo-200 transition-colors line-clamp-2 md:line-clamp-1 mb-3 tracking-wide">
                              {rm.skill || "Unknown Skill"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4">
                              <span className="text-xs md:text-sm font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/20 px-3 py-1.5 md:px-4 md:py-1.5 rounded-xl border border-indigo-500/20 shadow-sm">
                                {rm.level}
                              </span>
                              {isTech && <span className="text-xs md:text-sm font-bold text-cyan-300 bg-cyan-900/40 px-3 py-1.5 md:px-4 md:py-1.5 rounded-xl border border-cyan-700/50 shadow-sm flex items-center gap-2">💻 Tech</span>}
                            </div>
                          </div>

                          {/* Circular Progress (Larger) */}
                          <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center bg-slate-950/30 rounded-full backdrop-blur-sm shadow-inner border border-white/5 self-end lg:self-start">
                            <svg className="w-full h-full transform -rotate-90 p-1">
                              <circle cx="50%" cy="50%" r="36%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                              <circle cx="50%" cy="50%" r="36%" stroke="currentColor" strokeWidth="8" fill="transparent"
                                className={`${percent === 100 ? 'text-emerald-400' : 'text-indigo-400'}`}
                                strokeDasharray={226}
                                strokeDashoffset={226 - (226 * percent) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute text-lg md:text-xl font-bold text-white">{percent}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm md:text-lg text-slate-400 mb-6 mt-auto font-medium">
                          <span className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/5">
                            <span className={`${streak > 0 ? 'text-amber-400' : 'text-slate-600'} text-lg md:text-2xl`}>🔥</span> {streak} Day Streak
                          </span>
                          <span className="bg-slate-900/40 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/5 text-slate-300">{completed}/{total} Modules</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800/80 rounded-full h-4 mb-6 overflow-hidden border border-white/5 p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.6)] ${percent === 100 ? 'bg-emerald-400' : rm.isCoding !== false ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400' : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <Link
                          to={`/roadmap/${rm._id}`}
                          className="w-full text-center py-5 rounded-2xl bg-white/5 hover:bg-indigo-600 border border-white/10 text-lg font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-3 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] group-hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Continue Learning <span className="text-2xl leading-none">→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* =====================
              RIGHT: AI MENTOR (Span 4 - NARROWER)
          ====================== */}
          <div className="lg:col-span-12 xl:col-span-4 animate-slide-up mt-8 lg:mt-0" style={{ animationDelay: '0.2s' }}>
            <div className="glass-panel h-[600px] lg:h-[calc(100vh-180px)] flex flex-col relative overflow-hidden border border-white/10 shadow-2xl rounded-3xl">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"></div>
              {/* Header */}
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-heading">AI Mentor</h2>
                    <p className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> Online & Ready
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <button
                    onClick={clearChat}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    title="Clear Chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  <span className="absolute right-0 top-full mt-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    Clear Chat
                  </span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {chat.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                    <div className="text-6xl mb-4 grayscale">👋</div>
                    <p className="text-lg">Asking for help is a superpower.</p>
                    <p className="text-sm">Ask me about your code, concepts, or career path.</p>
                  </div>
                )}

                {chat.map((c, i) => (
                  <div
                    key={i}
                    className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-lg backdrop-blur-sm text-lg ${c.role === "user"
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-none border border-indigo-400/30"
                        : "bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none"
                        }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{c.text}</p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="flex gap-2 sm:gap-5">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your question..."
                    className="flex-1 bg-slate-900/80 border border-slate-700 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-white text-base sm:text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans shadow-inner w-full"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[3rem] w-auto sm:w-16 px-4 sm:px-0 flex-shrink-0 rounded-2xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
