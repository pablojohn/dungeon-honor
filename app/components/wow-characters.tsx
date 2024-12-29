import React from "react";
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
  return (
    <div className="flex flex-wrap gap-4">
      {characters && characters.map((character) => (
        <div key={character.id}>
          <Card key={character.id} realm={character.realm} name={character.name} playable_class={character.class} playable_race={character.race} />
        </div>
      ))}
    </div>
  )
}