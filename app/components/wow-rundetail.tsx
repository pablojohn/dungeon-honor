import React from 'react';
import { RunDetailCard } from './rundetail-card';

interface WoWRunDetailProps {
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

export const WoWRunDetail: React.FC<WoWRunDetailProps> = ({ num_chests, clear_time_ms, time_remaining_ms, characters }) => {
  const clearTimeSeconds = Math.floor(clear_time_ms / 1000);
  const timeRemainingSeconds = Math.floor(time_remaining_ms / 1000);

  return (
    <div className="flex flex-wrap gap-4">
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
              <span className="font-medium">{clearTimeSeconds} seconds</span>
            </li>
          )}
          {time_remaining_ms !== undefined && (
            <li>
              <span>Time remaining: </span>
              <span className="font-medium">{timeRemainingSeconds} seconds</span>
            </li>
          )}
        </ul>
      </div>
      {characters &&
        characters.map((character) => (
          <div key={character.id}>
            <RunDetailCard name={character.name} realm={character.realm} />
          </div>
        ))}
    </div>
  );
};
