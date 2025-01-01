import { Apple } from "lucide-react";

interface HonorScoreProps {
  score: number;
}

const HonorScore: React.FC<HonorScoreProps> = ({ score }) => {
  const renderAppleRating = (score: number) => {
    const apples = Math.round((score / 100) * 5); // Convert percentage to a 1-5 rating
    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Apple
            key={i}
            size={40} // Larger size for icons
            color={i < apples ? "green" : "gray"} // Green for filled, gray for unfilled
            fill={i < apples ? "green" : "none"} // Fill for filled apples
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-center mt-6 border-2 border-gray-300 rounded-lg p-4 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Honor Score</h2>
      <p className="text-green-600 text-4xl font-semibold">{score.toFixed(2)}%</p>
      {renderAppleRating(score)}
    </div>
  );
};

export default HonorScore;
