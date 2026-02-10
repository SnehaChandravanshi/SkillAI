import { useMemo } from "react";


export default function ActivityHeatmap({ data }) {
    // Generate last 365 days
    const today = new Date();
    const days = useMemo(() => {
        const result = [];
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            result.push(d);
        }
        return result;
    }, []);

    const getIntensity = (date) => {
        const dateStr = date.toISOString().split("T")[0];
        const activity = data.find((d) => d.date === dateStr);
        const count = activity ? activity.count : 0;

        if (count === 0) return "bg-slate-800";
        if (count <= 2) return "bg-emerald-900";
        if (count <= 5) return "bg-emerald-700";
        if (count <= 10) return "bg-emerald-500";
        return "bg-emerald-400";
    };

    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-2">
            <div className="flex gap-2 min-w-max">
                {/* Render columns (weeks) */}
                {Array.from({ length: 53 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-2">
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const dayOfYearIndex = weekIndex * 7 + dayIndex;
                            const date = days[dayOfYearIndex];

                            if (!date) return null; // Overflow protection

                            return (
                                <div
                                    key={dayIndex}
                                    className={`w-5 h-5 rounded-md ${getIntensity(date)} transition-all hover:ring-2 hover:ring-white/50 hover:scale-125 cursor-help`}
                                    title={`${date.toDateString()}: ${data.find((d) => d.date === date.toISOString().split("T")[0])?.count || 0
                                        } contributions`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 mt-4 text-sm text-slate-400 justify-end font-medium">
                <span>Less</span>
                <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700"></div>
                <div className="w-5 h-5 rounded-md bg-emerald-900 border border-emerald-800"></div>
                <div className="w-5 h-5 rounded-md bg-emerald-700 border border-emerald-600"></div>
                <div className="w-5 h-5 rounded-md bg-emerald-500 border border-emerald-400"></div>
                <div className="w-5 h-5 rounded-md bg-emerald-400 border border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                <span>More</span>
            </div>
        </div>
    );
}
