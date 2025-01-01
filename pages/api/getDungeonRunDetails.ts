import { NextApiRequest, NextApiResponse } from 'next';

interface Character {
  id: string;
  name: string;
  realm: string;
  role: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { keystone_run_id, exclude_name, exclude_realm } = req.query;

  const response = await fetch(`https://raider.io/api/v1/mythic-plus/run-details?season=season-tww-1&id=${keystone_run_id}`);

  if (!response.ok) {
    res.status(response.status).json({ error: 'Failed to fetch dungeon run detail from raiderio' });
    return;
  }

  const data = await response.json();

  if (!data.roster) {
    res.status(400).json({ error: 'Invalid response structure, no roster found' });
    return;
  }

  const filteredData = {
    num_chests: data.num_chests,
    clear_time_ms: data.clear_time_ms,
    time_remaining_ms: data.time_remaining_ms,
    characters: data.roster
      .map((entry: { character: { id: string; name: string; realm: { name: string }, spec: { role: string; } } }) => ({
        id: entry.character.id,
        name: entry.character.name,
        realm: entry.character.realm.name,
        role: entry.character.spec.role
      }))
      .filter((character: Character) => !(character.name === exclude_name && character.realm === exclude_realm)), // Exclude character
  };

  res.status(200).json(filteredData);
}