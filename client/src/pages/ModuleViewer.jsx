import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ModuleViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState(null);

    useEffect(() => {
        const fetchModule = async () => {
            const res = await api.get(`/modules/${id}`);
            setModule(res.data);
        };
        fetchModule();
    }, [id]);

    if (!module) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-6 lg:p-10 container mx-auto max-w-5xl">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    &larr; Back to Roadmap
                </button>

                <header className="mb-8 animate-fade-in">
                    <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                        {module.title}
                    </h1>
                </header>

                <div className="space-y-8 animate-slide-up">
                    {/* Explanation Section */}
                    <div className="glass-card p-6 lg:p-8 group">
                        <h2 className="text-xl font-bold font-heading mb-4 text-white flex items-center gap-2">
                            <span className="text-indigo-400">📖</span> Concept
                        </h2>

                        <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-indigo-500 mb-6">
                            <p className="text-lg text-slate-200 leading-relaxed font-medium">
                                {module.content.explanation.definition}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Key Characteristics</h3>
                                <ul className="space-y-2">
                                    {module.content.explanation.keyCharacteristics.map((char, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-300">
                                            <span className="text-indigo-400 mt-1">•</span>
                                            {char}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-2">Use Cases</h3>
                                <ul className="space-y-2">
                                    {module.content.explanation.useCases.map((useCase, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-300">
                                            <span className="text-emerald-400 mt-1">✓</span>
                                            {useCase}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Code Examples */}
                    <div className="glass-card p-6 lg:p-8 group">
                        <h2 className="text-xl font-bold font-heading mb-4 text-white flex items-center gap-2">
                            <span className="text-cyan-400">💻</span> Code Examples
                        </h2>
                        {module.content.codeExamples.map((ex, i) => (
                            <div key={i} className="mb-6 last:mb-0">
                                <h3 className="font-medium text-lg text-slate-200 mb-2">{ex.title}</h3>
                                <div className="relative group">
                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <pre className="bg-slate-900 text-slate-300 p-6 rounded-lg overflow-x-auto border border-slate-700 font-mono text-sm leading-relaxed shadow-inner">
                                        <code>{ex.code}</code>
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Common Mistakes */}
                    <div className="glass-card p-6 lg:p-8 border-l-4 border-l-amber-500">
                        <h2 className="text-xl font-bold font-heading mb-4 text-white flex items-center gap-2">
                            <span className="text-amber-400">⚠️</span> Common Mistakes
                        </h2>
                        <ul className="grid gap-3">
                            {module.content.commonMistakes.map((m, i) => (
                                <li key={i} className="flex items-start gap-3 bg-amber-500/5 p-3 rounded text-slate-300">
                                    <span className="text-amber-500 mt-1">✕</span>
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Practice Tasks */}
                    <div className="glass-card p-6 lg:p-8">
                        <h2 className="text-xl font-bold font-heading mb-4 text-white flex items-center gap-2">
                            <span className="text-purple-400">🛠️</span> Practice
                        </h2>
                        <div className="space-y-4">
                            {module.content.practiceTasks.map((task, i) => (
                                <div key={i} className="border border-slate-700 p-5 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                                    <h3 className="font-bold text-white mb-2">{task.title}</h3>
                                    <p className="mb-3 text-slate-400">{task.description}</p>
                                    {task.code && (
                                        <pre className="bg-black text-emerald-400 p-3 rounded text-sm overflow-x-auto border border-slate-800">
                                            <code>{task.code}</code>
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700/50">
                        <button
                            onClick={async () => {
                                await api.post("/progress/complete", {
                                    roadmapId: module.roadmapId,
                                    moduleId: module._id,
                                });
                                // alert("Module marked as completed!");
                            }}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <span>✅</span> Mark as Complete
                        </button>

                        <button
                            onClick={() => navigate(`/quiz/${module._id}`)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1 flex items-center justify-center gap-2 border border-slate-600"
                        >
                            <span>📝</span> Take Quiz
                        </button>

                        {/* Show Coding Challenge only for technical roadmaps */}
                        {module.roadmapId?.isCoding !== false && (
                            <button
                                onClick={() =>
                                    navigate(`/challenge/${module._id}`)
                                }
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                            >
                                <span>💻</span> Coding Challenge
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
