import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BehaviorGraphProps {
  chartData: { name: string; value: number }[];
}

const BehaviorGraph = ({ chartData }: BehaviorGraphProps) => {
  const getBarColor = (name: string) => {
    switch (name) {
      case "Uses Defensives":
        return "url(#blueGradient)";
      case "Good Comms":
        return "url(#yellowGradient)";
      case "Giga Heals":
        return "url(#greenGradient)";
      case "Big Dam":
        return "url(#redGradient)";
      default:
        return "#8884d8"; // Default color
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-700 p-8 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">
        Behaviors
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#007bff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#0056b3" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffc107" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#b38f00" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#28a745" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#1e7e34" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dc3545" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#b21f2d" stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />

          {/* Axes */}
          <XAxis
            dataKey="name"
            tick={{ fill: "#ccc", fontSize: 12 }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
          />
          <YAxis
            tick={{ fill: "#ccc", fontSize: 12 }}
            axisLine={{ stroke: "#666" }}
            tickLine={{ stroke: "#666" }}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{ backgroundColor: "#333", borderRadius: "8px", border: "none" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#ccc" }}
          />

          {/* Bars */}
          <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
            {chartData.map((data, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(data.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BehaviorGraph;
