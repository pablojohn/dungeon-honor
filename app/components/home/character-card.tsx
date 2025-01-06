import React from "react";

interface CardProps {
  realm: string;
  name: string;
  playable_class: string;
  playable_race: string;
}

export const CharacterCard: React.FC<CardProps> = ({ realm, name, playable_class, playable_race }) => {
  return (
    <div className="relative mx-auto max-w-sm overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-blue-400">{name}</h2>
        <p className="mt-2 text-lg text-gray-300">
          {playable_race} <span className="font-medium text-gray-400">{playable_class}</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">{realm}</p>
      </div>
      {/* Decorative Element */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-br from-blue-500/20 via-transparent to-pink-500/20 opacity-50 blur-lg" />
    </div>
  );
};
