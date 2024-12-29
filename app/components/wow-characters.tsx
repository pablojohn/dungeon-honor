import React, { useState } from "react";
import { Card } from "./card";

interface Character {
  id: number;
  realm: string;
  name: string;
  class: string;
  race: string;
}

interface WoWCharactersProps {
  characters: Character[];
}

export const WoWCharacters: React.FC<WoWCharactersProps> = ({ characters }) => {
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    // Toggle between showing and hiding the content for this card
    setActiveCharacterId(prevId => (prevId === id ? null : id));
  };

  // Get the active character details
  const activeCharacter = characters.find(character => character.id === activeCharacterId);

  return (
    <div className="flex flex-wrap gap-4">
      {characters && characters.map((character) => (
        <div key={character.id} onClick={() => handleCardClick(character.id)}>
          <Card 
            realm={character.realm} 
            name={character.name} 
            playable_class={character.class} 
            playable_race={character.race} 
          />
        </div>
      ))}
      
      {/* Conditionally render the content for the active character */}
      {activeCharacterId && activeCharacter && (
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-xl font-bold">World of Warcraft Dat (RaiderIO)</h2>
          <div className="flex flex-col rounded-md bg-neutral-100">
            <pre className="whitespace-pre-wrap break-all px-4 py-6">
              Raider IO data for {activeCharacter.name} from {activeCharacter.realm}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
