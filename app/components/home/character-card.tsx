import React from 'react';

interface CardProps {
  realm: string;
  name: string;
  playable_class: string;
  playable_race: string;
}

export const CharacterCard: React.FC<CardProps> = ({ realm, name, playable_class, playable_race }) => {
  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-600">{playable_race} {playable_class}</p>
        <p className="text-sm text-gray-600">{realm}</p>
      </div>
    </div>
  );
};
