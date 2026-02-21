"use client";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface BorrowTrendItem {
    date: string;
    count: number;
}

interface GenreItem {
    genre: string;
    count: number;
}

interface Props {
    borrowTrend: BorrowTrendItem[];
    genreData: GenreItem[];
}

const COLORS = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
    "#84cc16",
];

const DashboardCharts = ({ borrowTrend, genreData }: Props) => {
    return (
        <div className="dashboard-charts-grid">
            {/* Borrow Trend */}
            <div className="dashboard-chart-card">
                <h3 className="dashboard-chart-title">Borrow Activity</h3>
                <p className="dashboard-chart-subtitle">Last 7 days</p>
                <div className="dashboard-chart-container">
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={borrowTrend}>
                            <defs>
                                <linearGradient
                                    id="colorBorrow"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#6366f1"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#6366f1"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#1e293b",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "12px",
                                    padding: "8px 12px",
                                }}
                                labelStyle={{ color: "#94a3b8" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorBorrow)"
                                name="Borrows"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Genre Distribution */}
            <div className="dashboard-chart-card">
                <h3 className="dashboard-chart-title">Books by Genre</h3>
                <p className="dashboard-chart-subtitle">Distribution</p>
                <div className="dashboard-chart-container">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={genreData.slice(0, 8)}
                            layout="vertical"
                            margin={{ left: 0, right: 16 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="genre"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#64748b" }}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#1e293b",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "12px",
                                    padding: "8px 12px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[0, 4, 4, 0]}
                                name="Books"
                            >
                                {genreData.slice(0, 8).map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
