import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, realm } = req.query;

  const response = await fetch(`https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_weekly_highest_level_runs`);
  if (!response.ok) {
    res.status(response.status).json({ error: 'Failed to fetch data' });
    return;
  }
  const data = await response.json();

  res.status(200).json(data);
}