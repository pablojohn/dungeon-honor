import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

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
      <div className="flex justify-center mt-4 space-x-4">
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none">
          <ThumbsUp className="w-5 h-5 mr-2" />
          Thumbs Up
        </button>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none">
          <ThumbsDown className="w-5 h-5 mr-2" />
          Thumbs Down
        </button>
      </div>
    </div>
  );
};
