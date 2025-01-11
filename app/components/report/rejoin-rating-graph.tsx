import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RejoinData {
  success: boolean;
  data: { key: string }[];
  message: string;
}

interface RejoinRatingGraphProps {
  rejoinData: RejoinData | null;
}

const RejoinRatingGraph: React.FC<RejoinRatingGraphProps> = ({ rejoinData }) => {
  // Process rejoin data and aggregate counts for true and false ratings
  const processRejoinData = () => {
    if (!rejoinData?.data) return [];

    const ratingCounts = {
      true: 0,
      false: 0,
    };

    rejoinData.data.forEach((item) => {
      const rating = item.key.split(":").pop(); // Extract the last part of the key (true or false)
      if (rating === "true") {
        ratingCounts.true += 1;
      } else if (rating === "false") {
        ratingCounts.false += 1;
      }
    });

    // Return the processed data for the bar graph
    return [
      { name: "Yes", value: ratingCounts.true },
      { name: "No", value: ratingCounts.false },
    ];
  };

  const rejoinChartData = processRejoinData();

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-700 p-2 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">
        Rejoin Rating
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={rejoinChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {/* Gradients */}
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a2be2" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#5d189c" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8c00" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#cc6a00" stopOpacity={0.6} />
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
            {rejoinChartData.map((data, index) => (
              <Cell
                key={`cell-${index}`}
                fill={data.name === "Yes" ? "url(#purpleGradient)" : "url(#orangeGradient)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RejoinRatingGraph;
