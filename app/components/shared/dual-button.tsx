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

  // Handle button click: Disable both buttons after either is clicked
  const handlePlusClick = () => {
    onPlusClick();
    setIsDisabled(true); // Disable both buttons after click
  };

  const handleMinusClick = () => {
    onMinusClick();
    setIsDisabled(true); // Disable both buttons after click
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
        return "bg-green-500 hover:bg-green-600"; // Default color
    }
  };

  // Disabled button color, opacity, and styling
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
        return "bg-green-300 cursor-not-allowed opacity-60"; // Default color
    }
  };

  return (
    <div className="flex flex-col items-stretch w-fit border border-green-500 rounded-lg">
      <div className={`flex items-center px-4 py-2 text-base font-medium text-center ${getButtonColor()} text-white border-b`}>
        {/* Display the icon and title side by side */}
        <span className="mr-2">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="border-t border-green-300"></div>
      <div className="flex divide-x divide-green-700">
        <button
          onClick={handlePlusClick}
          disabled={isDisabled} // Disable if a choice has been made
          className={`flex-1 px-4 py-2 text-base font-medium text-white focus:outline-none 
            ${isDisabled ? getDisabledButtonColor() : getButtonColor()}
            ${!isDisabled ? 'hover:bg-opacity-80' : ''} flex justify-center items-center`}
        >
          <Plus />
        </button>
        <button
          onClick={handleMinusClick}
          disabled={isDisabled} // Disable if a choice has been made
          className={`flex-1 px-4 py-2 text-base font-medium text-white focus:outline-none 
            ${isDisabled ? getDisabledButtonColor() : getButtonColor()}
            ${!isDisabled ? 'hover:bg-opacity-80' : ''} flex justify-center items-center`}
        >
          <Minus />
        </button>
      </div>
    </div>
  );
};

export default DualButton;
