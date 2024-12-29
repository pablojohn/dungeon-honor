import React, { useState } from "react";
import { DungeonCard } from "./dungeon-card";

interface Dungeon {
  name: string;
  mythic_level: number;
  keystone_run_id: number;
}

interface WoWDungeonProps {
  dungeons: Dungeon[];
}

export const WoWDungeon: React.FC<WoWDungeonProps> = ({ dungeons }) => {
  const [activeDungeonId, setActiveDungeonId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get the active dungeon details
  const activeDungeon = dungeons.find(dungeon => dungeon.keystone_run_id === activeDungeonId);

  return (
    <div className="flex flex-wrap gap-4">
      {dungeons && dungeons.map((dungeon) => (
        <div key={dungeon.keystone_run_id}>
          <DungeonCard
            name={dungeon.name}
            mythic_level={dungeon.mythic_level} />
        </div>
      ))}
    </div>
  )
}