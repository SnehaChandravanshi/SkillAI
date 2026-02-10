import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/api";

export default function Quiz() {
    const { moduleId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.post("/assessment/generate", {
                    moduleId,
                    topic: "Module Topic",
                    level: "beginner",
                });
                setAssessment(res.data);
            } catch (err) {
                console.error("Quiz load failed", err);
            }
        };
        fetchQuiz();
    }, [moduleId]);

    const handleAnswer = (idx) => {
        setAnswers({ ...answers, [currentQ]: idx });
    };

    const nextQuestion = () => {
        if (currentQ < assessment.questions.length - 1) {
            setCurrentQ(currentQ + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQ > 0) {
            setCurrentQ(currentQ - 1);
        }
    };

    const submit = async () => {
        try {
            const res = await api.post("/assessment/submit", {
                assessmentId: assessment._id,
                answers,
            });
            setResult(res.data);
        } catch (err) {
            alert("Submission failed");
        }
    };

    if (!assessment) return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        </>
    );

    // Results View
    if (result) {
        const percentage = Math.round((result.score / result.total) * 100);
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="glass-panel p-10 max-w-lg w-full text-center animate-slide-up">
                        <div className="text-6xl mb-4">
                            {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
                        </div>
                        <h1 className="text-3xl font-bold font-heading mb-2 text-white">Quiz Completed!</h1>
                        <p className="text-slate-400 mb-8">Here is how you performed.</p>

                        <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                                    className={percentage >= 80 ? "text-yellow-400" : "text-indigo-400"}
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * percentage) / 100}
                                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                                />
                            </svg>
                            <span className="absolute text-4xl font-bold text-white">{percentage}%</span>
                        </div>

                        <p className="text-xl text-white mb-8">
                            You scored <span className="font-bold text-indigo-400">{result.score}</span> out of <span className="font-bold">{result.total}</span>
                        </p>

                        <button
                            onClick={() => window.history.back()}
                            className="btn-primary w-full"
                        >
                            Back to Module
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Quiz View
    const question = assessment.questions[currentQ];
    const progress = ((currentQ + 1) / assessment.questions.length) * 100;

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-6 lg:p-10 container mx-auto flex flex-col items-center">

                <div className="w-full max-w-3xl mb-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                        <span>Question {currentQ + 1} of {assessment.questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="glass-card p-8 lg:p-12 max-w-3xl w-full relative animate-fade-in">
                    <h2 className="text-2xl lg:text-3xl font-bold font-heading text-white mb-8 leading-relaxed">
                        {question.question}
                    </h2>

                    <div className="space-y-4">
                        {question.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group flex items-center justify-between ${answers[currentQ] === idx
                                        ? "bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500"
                                        : "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-indigo-500/50"
                                    }`}
                            >
                                <span className={`font-medium text-lg ${answers[currentQ] === idx ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                                    {opt}
                                </span>
                                {answers[currentQ] === idx && (
                                    <span className="text-indigo-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
                        <button
                            onClick={prevQuestion}
                            disabled={currentQ === 0}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentQ === 0
                                    ? "text-slate-600 cursor-not-allowed"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            Previous
                        </button>

                        {currentQ === assessment.questions.length - 1 ? (
                            <button
                                onClick={submit}
                                disabled={Object.keys(answers).length < assessment.questions.length} // Force answer all? Optional.
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white px-8 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={nextQuestion}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:translate-x-1"
                            >
                                Next &rarr;
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
