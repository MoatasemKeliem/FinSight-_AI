import type { IChartData } from "../model/SimulateScenarioModel";

interface SimpleChartProps {
    data: IChartData | undefined | null;
}

const SimpleChart = ({ data }: SimpleChartProps) => {
    if (!data) {
        return <div className="text-sm text-gray-500">Loading chart data...</div>;
    }
    const { labels, data: values, x_axis_label, y_axis_label } = data;

    if (!values || values.length === 0) {
        return <div className="text-sm text-gray-500">No data available for chart.</div>;
    }

    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal;

    const width = 500;
    const height = 200;
    const padding = 40;

    const points = values.map((val, i) => {
        const x = padding + (i * (width - 2 * padding)) / (values.length - 1);
        const y = height - padding - ((val - minVal) * (height - 2 * padding)) / range;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                <span>{y_axis_label}</span>
                <span>{x_axis_label}</span>
            </div>
            <div className="relative w-full bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800 p-4">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                    {/* Grid lines */}
                    <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-gray-200 dark:text-slate-800" strokeWidth="1" />
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-gray-200 dark:text-slate-800" strokeWidth="1" />

                    {/* Area path */}
                    <path
                        d={`M ${padding},${height - padding} ${points} L ${width - padding},${height - padding} Z`}
                        fill="url(#gradient)"
                        className="opacity-20"
                    />

                    {/* Line path */}
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        className="text-indigo-600 dark:text-indigo-400"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                    />

                    {/* Data Points */}
                    {values.map((val, i) => {
                        const x = padding + (i * (width - 2 * padding)) / (values.length - 1);
                        const y = height - padding - ((val - minVal) * (height - 2 * padding)) / range;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                className="fill-white dark:fill-slate-900 stroke-indigo-600 dark:stroke-indigo-400"
                                strokeWidth="2"
                            />
                        );
                    })}

                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(79, 70, 229)" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 px-6">
                    {labels.map((label, i) => (
                        <span key={i} className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase">
                            {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleChart;
