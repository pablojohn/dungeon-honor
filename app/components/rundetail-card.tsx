import React from "react";
import { Sword, ShieldPlus, MessageSquareMore, HeartPulse } from "lucide-react";

interface CardProps {
  name: string;
  realm: string;
}

export const RunDetailCard: React.FC<CardProps> = ({ name, realm }) => {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">{realm}</p>
      </div>
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none">
          <Sword className="w-5 h-5 mr-2" />
          Big Dam
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none">
          <ShieldPlus className="w-5 h-5 mr-2" />
          Presses Defensives
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none">
          <MessageSquareMore className="w-5 h-5 mr-2" />
          Good Comms
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none">
          <HeartPulse className="w-5 h-5 mr-2" />
          Giga Heals
        </button>
      </div>
    </div>
  );
};
