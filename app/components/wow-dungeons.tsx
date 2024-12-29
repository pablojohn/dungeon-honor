import React, { useEffect, useState } from "react";
import { DungeonCard } from "./dungeon-card";

interface Dungeon {
  name: string;
  mythic_level: number;
  keystone_run_id: number;
}

interface WoWDungeonProps {
  dungeons: Dungeon[];
}

interface DungeonRunDetailData {

}

export const WoWDungeon: React.FC<WoWDungeonProps> = ({ dungeons }) => {
  const [activeDungeonId, setActiveDungeonId] = useState<number | null>(null);
  const [dungeonRunDetailData, setDungeonRunDetailData] = useState<any | null>(null);
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
          const response = await fetch(`/api/getDungeonRunDetails?keystone_run_id=${keystone_run_id}`);

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
    } else {

    }
  }, [activeDungeonId, activeDungeon]);

  return (
    <div className="flex flex-wrap gap-4">
      {dungeons && dungeons.map((dungeon) => (
        <div key={dungeon.keystone_run_id} onClick={() => handleCardClick(dungeon.keystone_run_id)}>
          <DungeonCard
            name={dungeon.name}
            mythic_level={dungeon.mythic_level} />
        </div>
      ))}
      {activeDungeonId && activeDungeon && (
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-xl font-bold">Dungeon Run</h2>
          <div className="flex flex-col rounded-md bg-neutral-100">
            <pre className="whitespace-pre-wrap break-all px-4 py-6">
              {dungeonRunDetailData ? JSON.stringify(dungeonRunDetailData, null, 2) : "No dungeon run details available."}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}