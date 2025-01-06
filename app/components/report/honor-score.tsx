import { Apple } from "lucide-react";

interface HonorScoreProps {
  score: number;
}

const HonorScore: React.FC<HonorScoreProps> = ({ score }) => {
  const renderAppleRating = (score: number) => {
    const apples = Math.round((score / 100) * 5); // Convert percentage to a 1-5 rating
    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Apple
            key={i}
            size={24} // Default size for smaller screens
            className="sm:w-10 sm:h-10" // Adjust for larger screens
            color={i < apples ? "green" : "gray"} // Green for filled, gray for unfilled
            fill={i < apples ? "green" : "none"} // Fill for filled apples
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-center mt-6 bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4">
        Honor Score
      </h2>
      <p className="text-3xl sm:text-5xl font-bold text-green-400 mb-3 sm:mb-4">
        {score.toFixed(2)}%
      </p>
      <div>{renderAppleRating(score)}</div>
    </div>
  );
};

export default HonorScore;
