import { NextApiRequest, NextApiResponse } from 'next';

interface MythicPlusRun {
  dungeon: string;
  mythic_level: number;
  keystone_run_id: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, realm } = req.query;

  const response = await fetch(`https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_weekly_highest_level_runs`);

  if (!response.ok) {
    res.status(response.status).json({ error: 'Failed to fetch data' });
    return;
  }

  const data = await response.json();

  // Map over the data to extract only the necessary fields
  const reducedData = data.mythic_plus_weekly_highest_level_runs.map((run: MythicPlusRun) => ({
    dungeon: run.dungeon,
    mythic_level: run.mythic_level,
    keystone_run_id: run.keystone_run_id
  }));

  // Return the filtered data
  res.status(200).json({ dungeons: reducedData });
}