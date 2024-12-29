import React, { useState } from "react";
import { Sword, ShieldPlus, MessageSquareMore, HeartPulse } from "lucide-react";

interface CardProps {
  name: string;
  realm: string;
  slug: string; // Unique identifier for the run
}

const saveBehaviorToUpstash = async (slug: string, behavior: string) => {
  try {
    const response = await fetch("/api/saveBehavior", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, behavior }),
    });

    if (!response.ok) {
      throw new Error("Failed to save behavior");
    }
    console.log("Behavior saved successfully");
  } catch (error) {
    console.error(error);
  }
};

export const RunDetailCard: React.FC<CardProps> = ({ name, realm, slug }) => {
  const [selectedBehavior, setSelectedBehavior] = useState<string | null>(null);

  const handleButtonClick = (behavior: string) => {
    saveBehaviorToUpstash(slug, behavior);
    setSelectedBehavior(behavior); // Update state with the selected behavior
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{realm}</p>
      </div>
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        <button
          onClick={() => handleButtonClick("Big Dam")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          <Sword className="w-5 h-5 mr-2" />
          Big Dam
        </button>
        <button
          onClick={() => handleButtonClick("Uses Defensives")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <ShieldPlus className="w-5 h-5 mr-2" />
          Uses Defensives
        </button>
        <button
          onClick={() => handleButtonClick("Good Comms")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none"
        >
          <MessageSquareMore className="w-5 h-5 mr-2" />
          Good Comms
        </button>
        <button
          onClick={() => handleButtonClick("Giga Heals")}
          className="flex items-center px-4 py-2 text-base font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
        >
          <HeartPulse className="w-5 h-5 mr-2" />
          Giga Heals
        </button>
      </div>
      {selectedBehavior && (
        <div className="mt-4 text-center text-sm text-gray-700">
          You selected: <span className="font-medium">{selectedBehavior}</span>
        </div>
      )}
    </div>
  );
};
