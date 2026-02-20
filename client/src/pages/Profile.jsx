import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ActivityHeatmap from "../components/ActivityHeatmap";
import api from "../api/api";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/profile/stats");
                setProfileData(res.data);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (!profileData) return null;

    const { user, stats, activity } = profileData;

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-100 selection:bg-indigo-500/30">
            <Navbar />

            <main className="flex-1 container mx-auto px-8 py-16 max-w-[1600px] animate-fade-in">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 md:mb-16 relative">
                    {/* Header Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none"></div>

                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl sm:text-5xl md:text-7xl font-bold shadow-2xl ring-4 sm:ring-8 ring-white/5 relative z-10">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left relative z-10">
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-heading mb-3 md:mb-4 text-white drop-shadow-lg">{user.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center md:justify-start">
                            {user.role === 'admin' && (
                                <span className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold border border-amber-500/30 uppercase tracking-widest shadow-lg shadow-amber-900/20 backdrop-blur-md">
                                    Admin
                                </span>
                            )}
                            <span className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-500/30 uppercase tracking-widest shadow-lg shadow-indigo-900/20 backdrop-blur-md">
                                {user.experienceLevel || "Beginner"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
                    <StatCard
                        label="Current Streak"
                        value={stats.streak}
                        icon="🔥"
                        color="text-amber-400"
                        subtext="Days in a row"
                        delay="0s"
                    />
                    <StatCard
                        label="Problems Solved"
                        value={stats.problemsSolved}
                        icon="✅"
                        color="text-emerald-400"
                        subtext="Challenges completed"
                        delay="0.1s"
                    />
                    <StatCard
                        label="Avg. Accuracy"
                        value={`${stats.accuracy}%`}
                        icon="🎯"
                        color="text-cyan-400"
                        subtext="Across all quizzes"
                        delay="0.2s"
                    />
                    <StatCard
                        label="Modules Done"
                        value={stats.totalModulesCompleted}
                        icon="📚"
                        color="text-indigo-400"
                        subtext="Learning units"
                        delay="0.3s"
                    />
                </div>

                {/* Activity Heatmap */}
                <div className="glass-panel p-4 sm:p-10 animate-slide-up shadow-2xl border border-white/5 relative overflow-hidden group" style={{ animationDelay: '0.4s' }}>
                    <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-[80px] sm:blur-[100px] -z-10 transition-opacity opacity-50 group-hover:opacity-100"></div>

                    <h2 className="text-xl sm:text-3xl font-bold font-heading mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 sm:p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Activity Log
                        </div>
                        <span className="text-xs sm:text-base font-normal text-slate-400 sm:ml-auto bg-slate-900/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-700/50 shadow-inner">Last 365 Days</span>
                    </h2>
                    <div className="w-full overflow-x-auto pb-4">
                        <ActivityHeatmap data={activity} />
                    </div>
                </div>

            </main>
        </div>
    );
}

function StatCard({ label, value, icon, color, subtext, delay }) {
    return (
        <div
            className="glass-card p-4 sm:p-8 flex flex-col items-center text-center hover:bg-slate-800/80 transition-all group cursor-default border border-white/5 hover:border-indigo-500/30 shadow-xl animate-slide-up relative overflow-hidden"
            style={{ animationDelay: delay }}
        >
            <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            <div className={`text-4xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 filter drop-shadow-2xl`}>
                {icon}
            </div>
            <div className={`text-3xl sm:text-5xl font-bold font-heading mb-2 sm:mb-3 ${color} drop-shadow-sm`}>
                {value}
            </div>
            <div className="text-sm sm:text-lg font-bold text-slate-200 uppercase tracking-widest mb-1 sm:mb-2 group-hover:text-white transition-colors">
                {label}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium group-hover:text-slate-400 transition-colors">
                {subtext}
            </div>
        </div>
    );
}
