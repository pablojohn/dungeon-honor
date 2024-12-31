import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

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

    rejoinData.data.forEach(item => {
      const rating = item.key.split(':').pop(); // Extract the last part of the key (true or false)
      if (rating === 'true') {
        ratingCounts.true += 1;
      } else if (rating === 'false') {
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
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">
        Rejoin Rating
      </h2>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={rejoinChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend
              payload={rejoinChartData.map((data) => ({
                id: data.name,
                value: data.name,
                type: "line", // Adjust the shape of legend items if needed
                color: data.name === 'Yes' ? '#8a2be2' : '#ff8c00', // Purple for Yes, Orange for No
              }))}
            />
            <Bar dataKey="value" radius={5}>
              {rejoinChartData.map((data, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={data.name === 'Yes' ? '#8a2be2' : '#ff8c00'} // Purple for Yes, Orange for No
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RejoinRatingGraph;
