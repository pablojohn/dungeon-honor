// components/BehaviorGraph.tsx

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BehaviorGraphProps {
  name: string;
  realm: string;
  chartData: { name: string; value: number }[];
}

const BehaviorGraph = ({ name, realm, chartData }: BehaviorGraphProps) => {
  const getBarColor = (name: string) => {
    switch (name) {
      case "Good Comms":
        return "#28a745"; // Green
      case "Giga Heals":
        return "#ffc107"; // Yellow
      case "Big Dam":
        return "#dc3545"; // Red
      default:
        return "#8884d8"; // Default color
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">
        {name} - {realm}
      </h2>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" radius={5}>
              {chartData.map((data, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(data.name)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BehaviorGraph;