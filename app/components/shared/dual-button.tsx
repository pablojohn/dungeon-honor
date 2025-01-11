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
    <div className="flex flex-col w-full max-w-xs sm:max-w-sm rounded-lg shadow-md overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900">
      {/* Title Section */}
      <div
        className={`flex items-center justify-center px-4 py-2 font-semibold text-white border-b border-gray-700 ${getButtonColor()} gap-1`}
        style={{
          height: "3rem", // Ensure consistent height
          fontSize: "1rem", // Explicit font size for mobile
          lineHeight: "1.25rem", // Prevent line-height issues
        }}
      >
        <span className="flex items-center flex-shrink-0">{icon}</span>
        <span className="text-center">{title}</span>
      </div>

      {/* Buttons Section */}
      <div className="flex divide-x divide-gray-700 h-[2.5rem]">
        <button
          onClick={handlePlusClick}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center h-full px-2 py-1 text-white font-medium transition
            ${isDisabled ? getDisabledButtonColor() : getButtonColor()}
            ${!isDisabled ? "hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500" : ""}
          `}
          style={{
            fontSize: "0.875rem", // Explicit font size for mobile
            lineHeight: "1rem", // Consistent line-height
          }}
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={handleMinusClick}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center h-full px-2 py-1 text-white font-medium transition
            ${isDisabled ? getDisabledButtonColor() : getButtonColor()}
            ${!isDisabled ? "hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500" : ""}
          `}
          style={{
            fontSize: "0.875rem", // Explicit font size for mobile
            lineHeight: "1rem", // Consistent line-height
          }}
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DualButton;
