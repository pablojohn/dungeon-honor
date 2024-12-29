import React, { useState, useEffect } from "react";
import { CharacterCard } from "./character-card";
import { WoWDungeon } from "./wow-dungeons";

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

interface DungeonData {
  dungeons: { name: string; mythic_level: number; keystone_run_id: number }[]; // Adjust structure as per your API response
}

export const WoWCharacters: React.FC<WoWCharactersProps> = ({ characters }) => {
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(null);
  const [dungeonData, setDungeonData] = useState<DungeonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (id: number) => {
    setActiveCharacterId((prevId) => (prevId === id ? null : id));
  };

  // Get the active character details
  const activeCharacter = characters.find((character) => character.id === activeCharacterId);

  // Fetch dungeons when activeCharacterId changes
  useEffect(() => {
    if (activeCharacterId && activeCharacter) {
      const { name, realm } = activeCharacter;

      const fetchDungeons = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/getDungeons?name=${name}&realm=${realm}`);

          if (!response.ok) {
            throw new Error("Failed to fetch dungeons");
          }

          const data = await response.json();
          setDungeonData(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchDungeons();
    } else {
      setDungeonData(null); // Reset dungeon data if no character is active
    }
  }, [activeCharacterId, activeCharacter]);

  return (
    <div className="flex flex-wrap gap-4">
      {characters &&
        characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleCardClick(character.id)}
            className={`rounded-md transition-all ${activeCharacterId === character.id
                ? "border-2 border-gray-900 bg-white shadow-md"
                : "border border-gray-300 bg-white hover:shadow-sm"
              } cursor-pointer`}
          >
            <CharacterCard
              realm={character.realm}
              name={character.name}
              playable_class={character.class}
              playable_race={character.race}
            />
          </div>
        ))}
      {activeCharacterId && activeCharacter && (
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-xl font-bold">Dungeons</h2>
          <div className="flex flex-col rounded-md bg-neutral-100">
            {/* Loading, Error, or Data Display */}
            {loading && <p>Loading dungeons...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading &&
              !error &&
              (dungeonData && dungeonData.dungeons.length > 0 ? (
                <div>
                  <WoWDungeon dungeons={dungeonData.dungeons} />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-all px-4 py-6">
                  {activeCharacter.name} from {activeCharacter.realm} has completed no dungeons this week.
                </pre>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
