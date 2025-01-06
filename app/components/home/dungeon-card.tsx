import React from "react";

interface CardProps {
  name: string;
  mythic_level: number;
}

export const DungeonCard: React.FC<CardProps> = ({ name, mythic_level }) => {
  return (
    <div className="w-full h-full overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-blue-400">{name}</h2>
        <p className="mt-2 text-lg text-gray-300">
          Mythic Level: <span className="font-medium text-gray-400">{mythic_level}</span>
        </p>
      </div>
    </div>
  );
};
