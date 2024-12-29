import React from "react";

interface CardProps {
  name: string;
}

export const RunDetailCard: React.FC<CardProps> = ({ name }) => {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
      </div>
    </div>
  );
};