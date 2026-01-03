"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Trade {
  id: string;
  side: string;
  priceAfter: number;
  createdAt: string;
}

interface PriceChartProps {
  trades: Trade[];
  currentPYes: number;
}

export default function PriceChart({ trades, currentPYes }: PriceChartProps) {
  // Build chart data from trades (oldest first)
  const chartData = [...trades]
    .reverse()
    .map((trade, index) => ({
      index,
      price: trade.priceAfter * 100,
      time: new Date(trade.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      side: trade.side,
    }));

  // Add current price as the last point
  if (chartData.length > 0) {
    chartData.push({
      index: chartData.length,
      price: currentPYes * 100,
      time: "Now",
      side: "",
    });
  }

  // If no trades, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Price History</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-muted">Chart will appear after first trade</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        Price History{" "}
        <span className="text-sm font-normal text-muted">(YES probability)</span>
      </h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <XAxis
              dataKey="time"
              tick={{ fill: "#78716C", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E7E5E0" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#78716C", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#E7E5E0" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E7E5E0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#78716C" }}
              formatter={(value) => value !== undefined ? [`${Number(value).toFixed(1)}%`, "Yes"] : ["", "Yes"]}
            />
            <ReferenceLine
              y={50}
              stroke="#E7E5E0"
              strokeDasharray="3 3"
              label={{
                value: "50%",
                position: "right",
                fill: "#78716C",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#6B8E6B"
              strokeWidth={2}
              dot={{
                fill: "#6B8E6B",
                strokeWidth: 0,
                r: 3,
              }}
              activeDot={{
                r: 5,
                fill: "#6B8E6B",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-muted mt-2 px-1">
        <span>First trade</span>
        <span>Latest</span>
      </div>
    </div>
  );
}
