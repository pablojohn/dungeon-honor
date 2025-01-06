import React from 'react';
import { RunDetailCard } from './rundetail-card';

interface WoWRunDetailProps {
  keystone_run_id: number;
  num_chests: number;
  clear_time_ms: number;
  time_remaining_ms: number;
  characters: Character[];
  userId: string;
}

interface Character {
  id: number;
  name: string;
  realm: string;
  role: string;
}

export const WoWRunDetail: React.FC<WoWRunDetailProps> = ({ keystone_run_id, num_chests, clear_time_ms, time_remaining_ms, characters, userId }) => {
  const clearTimeSeconds = Math.floor(clear_time_ms / 1000);
  const timeRemainingSeconds = Math.floor(time_remaining_ms / 1000);

  // Helper function to format time in minutes or seconds
  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} minute${minutes !== 1 ? 's' : ''}${remainingSeconds > 0 ? ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : ''}`;
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  return (
    <div className="flex flex-col gap-4 flex-grow">
      {/* Run Details Panel */}
      <div className="w-full rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white shadow-lg">
        <ul className="flex flex-col sm:flex-wrap md:flex-nowrap items-start sm:items-center gap-6 text-lg">
          {num_chests !== undefined && (
            <li className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-semibold text-blue-400">Chests:</span>
              <span className="font-medium text-gray-300">{num_chests}</span>
            </li>
          )}
          {clear_time_ms !== undefined && (
            <li className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-semibold text-blue-400">Clear time:</span>
              <span className="font-medium text-gray-300">{formatTime(clearTimeSeconds)}</span>
            </li>
          )}
          {time_remaining_ms !== undefined && (
            <li className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="font-semibold text-blue-400">Time remaining:</span>
              <span className="font-medium text-gray-300">{formatTime(timeRemainingSeconds)}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Character Cards */}
      {characters &&
        characters.map((character) => {
          const slug = `${character.name
            .replace(" ", "-")
            .toLowerCase()}:${character.realm
              .replace(" ", "-")
              .toLowerCase()}:${keystone_run_id}:${userId}`;
          return (
            <div key={character.id}>
              <RunDetailCard
                name={character.name}
                realm={character.realm}
                role={character.role}
                slug={slug}
              />
            </div>
          );
        })}
    </div>
  );
};
