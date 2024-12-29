import React from 'react';

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
  return (
    <div>
      {num_chests && <p>Number of chests: {num_chests}</p>}
      {clear_time_ms && <p>Clear time: {clear_time_ms}</p>}
      {time_remaining_ms && <p>Time remaining: {time_remaining_ms}</p>}
      {characters && (
        <ul>
          {characters.map(character => (
            <li key={character.id}>{character.name} {character.id} {character.realm}</li>
          ))}
        </ul>
      )}
    </div>
  )
}