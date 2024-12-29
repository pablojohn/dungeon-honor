import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.query.access_token;

  const response = await fetch(`https://us.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to fetch characters from bnet' });
  }

  const bnetData = await response.json();

  var characters = getCharacterAndRealm(bnetData);

  res.status(200).json(characters);
}

function getCharacterAndRealm(data: BlizzardData): CharacterRealm[] {
  return data.wow_accounts.flatMap(account =>
    account.characters
      .filter(character => character.level === 80)
      .map(character => ({
        id: character.id,
        name: character.name,
        realm: character.realm.name,
        class: character.playable_class.name,
        race: character.playable_race.name
      }))
  );
}

interface Realm {
  name: string;
}

interface Character {
  id: number;
  name: string;
  realm: Realm;
  level: number;
  playable_class: CharacterClass;
  playable_race: CharacterRace;
}

interface WoWAccount {
  characters: Character[];
}

interface BlizzardData {
  wow_accounts: WoWAccount[];
}

interface CharacterRealm {
  name: string;
  realm: string;
}

interface CharacterClass {
  name: string;
}

interface CharacterRace {
  name: string;
}