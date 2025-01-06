import React, { useEffect, useState } from "react";
import { DungeonCard } from "./dungeon-card";
import { WoWRunDetail } from "./wow-rundetail";

interface Dungeon {
  name: string;
  mythic_level: number;
  keystone_run_id: number;
}

interface WoWDungeonProps {
  dungeons: Dungeon[];
  userId: string;
  characterName: string;
  characterRealm: string;
}

interface RunDetailData {
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
  role: string;
}

export const WoWDungeon: React.FC<WoWDungeonProps> = ({ dungeons, userId, characterName, characterRealm }) => {
  const [activeDungeonId, setActiveDungeonId] = useState<number | null>(null);
  const [dungeonRunDetailData, setDungeonRunDetailData] = useState<RunDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (id: number) => {
    setActiveDungeonId(prevId => (prevId === id ? null : id));
  };

  // Get the active dungeon details
  const activeDungeon = dungeons.find(dungeon => dungeon.keystone_run_id === activeDungeonId);

  // Fetch dungeon run details when activeDungeonId changes
  useEffect(() => {
    if (activeDungeonId && activeDungeon) {
      const { keystone_run_id } = activeDungeon;

      const fetchDungeonRunDetails = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(`/api/dungeonRunDetails?keystone_run_id=${keystone_run_id}&exclude_name=${characterName}&exclude_realm=${characterRealm}`);

          if (!response.ok) {
            throw new Error('Failed to fetch dungeon run details');
          }

          const data = await response.json();
          setDungeonRunDetailData(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };

      fetchDungeonRunDetails();
    }
  }, [activeDungeonId, activeDungeon, characterName, characterRealm]);

  return (
    <div className="flex flex-wrap gap-4">
      {/* Dungeon Cards */}
      <div className="flex flex-wrap gap-6 w-full">
        {dungeons.map((dungeon) => (
          <div
            key={dungeon.keystone_run_id}
            onClick={() => handleCardClick(dungeon.keystone_run_id)}
            className={`rounded-lg p-4 transition-transform duration-300 cursor-pointer ${activeDungeonId === dungeon.keystone_run_id
              ? "border-2 border-blue-500 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg transform scale-105"
              : "border border-gray-700 bg-gray-800 hover:shadow-md hover:scale-105"
              }`}
          >
            <DungeonCard
              name={dungeon.name}
              mythic_level={dungeon.mythic_level}
            />
          </div>
        ))}
      </div>

      {/* Active Dungeon Details */}
      {activeDungeonId && activeDungeon && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-lg transition-all duration-300">
          <h2 className="text-2xl font-bold text-white">
            Run Detail for <span className="text-blue-400">{activeDungeon.name} {activeDungeon.mythic_level}</span>
          </h2>
          <div className="flex flex-col gap-4 rounded-lg bg-gray-800 p-4">
            {loading && (
              <p className="text-center text-gray-400 animate-pulse">
                Loading run detail...
              </p>
            )}
            {error && (
              <p className="text-center text-red-500">
                Error loading dungeon details: {error}
              </p>
            )}
            {!loading && !error && (
              dungeonRunDetailData ? (
                <div>
                  <WoWRunDetail
                    keystone_run_id={activeDungeonId}
                    num_chests={dungeonRunDetailData.num_chests}
                    clear_time_ms={dungeonRunDetailData.clear_time_ms}
                    time_remaining_ms={dungeonRunDetailData.time_remaining_ms}
                    characters={dungeonRunDetailData.characters}
                    userId={userId}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  No dungeon run details available.
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}