import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Challenge() {
    const { moduleId } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await api.post("/challenge/get", {
                    moduleId,
                    topic: "Module Topic",
                    level: "beginner",
                });
                setChallenge(res.data);
                if (!code) setCode("// Write your solution here\n\nfunction solve() {\n  // TODO\n}");
            } catch (err) {
                console.error("Challenge load error", err);
            }
        };
        fetchChallenge();
    }, [moduleId]);

    const submitCode = async () => {
        setLoading(true);
        setFeedback(null);
        try {
            const res = await api.post("/challenge/submit", {
                challengeId: challenge._id,
                userCode: code,
            });
            setFeedback(res.data.aiFeedback);
        } catch (err) {
            setFeedback("Error submitting code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!challenge) return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 p-6 lg:p-10 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Panel: Problem Statement */}
                <div className="glass-panel p-8 h-full flex flex-col animate-slide-up">
                    <div className="mb-6">
                        <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                            Coding Challenge
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold font-heading mb-6 text-white">
                        {challenge.prompt?.title || "Coding Challenge"}
                    </h1>

                    <div className="prose prose-invert max-w-none text-slate-300 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="leading-relaxed text-lg mb-4">
                            {challenge.prompt?.description}
                        </p>

                        {challenge.prompt?.example && (
                            <div className="bg-slate-800/50 p-4 rounded-lg mb-6 font-mono text-sm border border-slate-700">
                                <strong className="text-indigo-400 block mb-2">Example:</strong>
                                {challenge.prompt.example}
                            </div>
                        )}

                        <div className="mt-4 bg-slate-800/50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <h3 className="text-amber-400 font-bold text-sm uppercase mb-1">💡 Hint</h3>
                            <p className="text-slate-400 italic">
                                {challenge.solutionHint}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Editor */}
                <div className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>

                    {/* Editor Area */}
                    <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative group">
                        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <span className="ml-4 text-xs font-mono text-slate-500">solution.js</span>
                        </div>

                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                            className="flex-1 w-full bg-slate-900 text-slate-300 font-mono p-4 text-sm leading-6 resize-none focus:outline-none focus:ring-0"
                        />

                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={submitCode}
                                disabled={loading}
                                className={`
                                    btn-primary flex items-center gap-2 shadow-xl
                                    ${loading ? 'opacity-75 cursor-wait' : ''}
                                `}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span> Run Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="h-1/3 bg-black rounded-xl border border-slate-800 p-4 font-mono text-sm overflow-y-auto shadow-inner relative">
                        <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 uppercase text-xs tracking-wider">
                            Console / Output
                        </div>

                        {feedback ? (
                            <div className="animate-fade-in">
                                <p className="text-emerald-400 mb-2">Analysis Complete:</p>
                                <pre className="whitespace-pre-wrap text-slate-300 font-mono leading-relaxed">
                                    {feedback}
                                </pre>
                            </div>
                        ) : (
                            <div className="text-slate-600 italic">
                                Ready to execute. output will appear here...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
