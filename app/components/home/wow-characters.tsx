import React, { useState, useEffect } from "react";
import { CharacterCard } from "./character-card";
import { WoWDungeon } from "./wow-dungeons";

interface Character {
  avatarUrl: string;
  id: number;
  realm: string;
  name: string;
  class: string;
  race: string;
}

interface WoWCharactersProps {
  characters: Character[];
  userId: string;
}

interface DungeonData {
  dungeons: { name: string; mythic_level: number; keystone_run_id: number }[];
}

export const WoWCharacters: React.FC<WoWCharactersProps> = ({ characters, userId }) => {
  const [activeCharacterId, setActiveCharacterId] = useState<number | null>(null);
  const [dungeonData, setDungeonData] = useState<DungeonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (id: number) => {
    setActiveCharacterId((prevId) => (prevId === id ? null : id));
  };

  const activeCharacter = characters.find((character) => character.id === activeCharacterId);

  useEffect(() => {
    if (activeCharacterId && activeCharacter) {
      const { name, realm } = activeCharacter;

      const fetchDungeons = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/dungeons?name=${name}&realm=${realm}`);
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
      setDungeonData(null);
    }
  }, [activeCharacterId, activeCharacter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Character Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleCardClick(character.id)}
            className={`relative rounded-lg p-4 cursor-pointer transition-colors duration-300 ease-in-out ${activeCharacterId === character.id
              ? "border-2 border-blue-500 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg transform scale-105"
              : "border border-gray-700 bg-gray-800 hover:shadow-md hover:scale-105"
              }`}
          >
            <CharacterCard
              avatarUrl={character.avatarUrl}
              realm={character.realm}
              name={character.name}
              playable_class={character.class}
              playable_race={character.race}
            />
          </div>
        ))}
      </div>

      {/* Dungeon Data Panel */}
      {activeCharacterId && activeCharacter && (
        <div
          className="flex flex-col gap-6 rounded-lg pt-6 sm:px-0 transition-all duration-500 ease-in-out opacity-0 scale-95"
          style={{
            animation: 'fadeInScale 0.5s forwards',
          }}
        >
          <h2 className="text-2xl font-bold text-white">
            Dungeons for <span className="text-blue-400">{activeCharacter.name}</span>
          </h2>
          <div className="flex flex-col gap-4">
            {loading && (
              <div className="text-center text-gray-400 animate-pulse">Loading dungeons...</div>
            )}
            {error && (
              <div className="text-center text-red-500">
                Failed to load dungeons: {error}
              </div>
            )}
            {!loading && !error && (
              <>
                {dungeonData && dungeonData.dungeons.length > 0 ? (
                  <WoWDungeon
                    dungeons={dungeonData.dungeons}
                    userId={userId}
                    characterName={activeCharacter.name}
                    characterRealm={activeCharacter.realm}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    No dungeons completed for {activeCharacter.name} this week.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
