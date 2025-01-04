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
      {dungeons && dungeons.map((dungeon) => (
        <div key={dungeon.keystone_run_id}
          onClick={() => handleCardClick(dungeon.keystone_run_id)}
          className={`rounded-md transition-all ${activeDungeonId === dungeon.keystone_run_id
            ? "border-2 border-gray-900 bg-white shadow-md"
            : "border border-gray-300 bg-white hover:shadow-sm"
            } cursor-pointer`}>
          <DungeonCard
            name={dungeon.name}
            mythic_level={dungeon.mythic_level} />
        </div>
      ))}
      {activeDungeonId && activeDungeon && (
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-xl font-bold">Run  Detail - <span className="text-base font-normal">Rate a teammates behavior</span></h2>
          <div className="flex flex-col rounded-md bg-neutral-100">
            {loading && <p>Loading run detail...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              dungeonRunDetailData ? (
                <div>
                  <WoWRunDetail
                    keystone_run_id={activeDungeonId}
                    num_chests={dungeonRunDetailData.num_chests}
                    clear_time_ms={dungeonRunDetailData.clear_time_ms}
                    time_remaining_ms={dungeonRunDetailData.time_remaining_ms}
                    characters={dungeonRunDetailData.characters}
                    userId={userId} />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-all px-4 py-6">
                  {dungeonRunDetailData ? JSON.stringify(dungeonRunDetailData, null, 2) : "No dungeon run details available."}
                </pre>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}