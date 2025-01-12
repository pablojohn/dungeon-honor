import { Shield } from "lucide-react";

interface HonorScoreProps {
  score: number;
}

const HonorScore: React.FC<HonorScoreProps> = ({ score }) => {
  const getRankDetails = (score: number) => {
    if (score >= 95) return { rank: "Legendary", color: "orange-500", flavor: "A Living Legend." };
    if (score >= 85) return { rank: "Epic", color: "purple-500", flavor: "An Epic Companion." };
    if (score >= 70) return { rank: "Rare", color: "blue-500", flavor: "A Reliable Adventurer." };
    if (score >= 50) return { rank: "Common", color: "green-500", flavor: "Getting There!" };
    return { rank: "Uncommon", color: "gray-400", flavor: "Room for Growth." };
  };

  const { rank, color, flavor } = getRankDetails(score);

  const renderHonorScoreShields = (score: number) => {
    const shieldsFilled = Math.round((score / 100) * 5);
    return (
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Shield
            key={i}
            size={36} // Default size for smaller screens
            className={`sm:w-12 sm:h-12 text-${i < shieldsFilled ? color : "gray-400"}`}
            fill={i < shieldsFilled ? `var(--tw-color-${color})` : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="text-center bg-gradient-to-b from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 shadow-lg">
      <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-3 sm:mb-4">
        Honor Score
      </h2>
      <p className={`text-3xl sm:text-5xl font-bold text-${color} mb-2`}>
        {score.toFixed(2)}
      </p>
      <p className="text-lg sm:text-xl font-medium text-gray-300">
        Rank: <span className={`text-${color} font-bold`}>{rank}</span>
      </p>
      <p className="text-sm sm:text-base text-gray-400 italic mt-2">
        {flavor}
      </p>
      {renderHonorScoreShields(score)}
    </div>
  );
};

export default HonorScore;
