import React from 'react';

interface CardProps {
  name: string;
  mythic_level: number;
}

export const DungeonCard: React.FC<CardProps> = ({ name, mythic_level }) => {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name} - {mythic_level}</h2>
      </div>
    </div>
  );
};
