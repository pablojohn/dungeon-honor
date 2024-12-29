import React from 'react';
import { RunDetailCard } from './rundetail-card';

interface WoWRunDetailProps {
  keystone_run_id: number;
  num_chests: number;
  clear_time_ms: number;
  time_remaining_ms: number;
  characters: Character[];
}

interface Character {
  id: number;
  name: string;
  realm: string;
}

export const WoWRunDetail: React.FC<WoWRunDetailProps> = ({ keystone_run_id, num_chests, clear_time_ms, time_remaining_ms, characters }) => {
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
    <div className="flex flex-col gap-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full">
        <ul className="flex space-x-6 text-gray-600">
          {num_chests !== undefined && (
            <li>
              <span>Chests: </span>
              <span className="font-medium">{num_chests}</span>
            </li>
          )}
          {clear_time_ms !== undefined && (
            <li>
              <span>Clear time: </span>
              <span className="font-medium">{formatTime(clearTimeSeconds)}</span>
            </li>
          )}
          {time_remaining_ms !== undefined && (
            <li>
              <span>Time remaining: </span>
              <span className="font-medium">{formatTime(timeRemainingSeconds)}</span>
            </li>
          )}
        </ul>
      </div>
      {characters &&
        characters.map((character) => {
          const slug = `${keystone_run_id}-${character.name.replace(' ', '-').toLowerCase()}-${character.realm.replace(' ', '-').toLowerCase()}`;
          return (
            <div key={character.id}>
              <RunDetailCard name={character.name} realm={character.realm} slug={slug} />
            </div>
          );
        })}
    </div>
  );
};
