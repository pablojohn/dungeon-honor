import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface DualButtonProps {
  onPlusClick: () => void;
  onMinusClick: () => void;
  title: string;
  icon: React.ReactNode;
  color: string; // Add color prop
}

const DualButton: React.FC<DualButtonProps> = ({
  onPlusClick,
  onMinusClick,
  title,
  icon,
  color, // Receive color prop
}) => {
  const [isDisabled, setIsDisabled] = useState(false); // Track if buttons should be disabled

  const handlePlusClick = () => {
    onPlusClick();
    setIsDisabled(true);
  };

  const handleMinusClick = () => {
    onMinusClick();
    setIsDisabled(true);
  };

  const getButtonColor = () => {
    switch (color) {
      case "red":
        return "bg-red-500 hover:bg-red-600";
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "yellow":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "green":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-600 hover:bg-gray-700"; // Default color
    }
  };

  const getDisabledButtonColor = () => {
    switch (color) {
      case "red":
        return "bg-red-300 cursor-not-allowed opacity-60";
      case "blue":
        return "bg-blue-300 cursor-not-allowed opacity-60";
      case "yellow":
        return "bg-yellow-300 cursor-not-allowed opacity-60";
      case "green":
        return "bg-green-300 cursor-not-allowed opacity-60";
      default:
        return "bg-gray-300 cursor-not-allowed opacity-60"; // Default color
    }
  };

  return (
    <div className="flex flex-col items-stretch w-full max-w-xs sm:max-w-sm rounded-lg shadow-md overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 h-32">
      {/* Title Section */}
      <div
        className={`flex flex-row items-center justify-center px-4 py-2 text-sm sm:text-base font-semibold text-white ${getButtonColor()} border-b border-gray-700 gap-2`}
        style={{ height: "3rem" }}
      >
        <span className="mt-0">{icon}</span>
        <span className="text-center">{title}</span>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-row divide-x divide-gray-700 h-full">
        <button
          onClick={handlePlusClick}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-white text-base font-medium focus:outline-none transition 
      ${isDisabled ? getDisabledButtonColor() : getButtonColor()} 
      ${!isDisabled ? "hover:bg-opacity-80 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" : ""}`}
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleMinusClick}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-white text-base font-medium focus:outline-none transition 
      ${isDisabled ? getDisabledButtonColor() : getButtonColor()} 
      ${!isDisabled ? "hover:bg-opacity-80 focus:ring-2 focus:ring-offset-2 focus:ring-red-500" : ""}`}
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DualButton;
