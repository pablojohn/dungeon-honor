import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get('Authorization');

  // Extract the token from the 'Authorization' header
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Access token is required in Authorization header' }, { status: 400 });
  }

  const accessToken = authorizationHeader.split(' ')[1]; // Get the token after 'Bearer '

  try {
    const response = await fetch(
      'https://us.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch characters from Battle.net' }, { status: 500 });
    }

    const bnetData = await response.json();
    const characters = getCharacterAndRealm(bnetData);

    return NextResponse.json(characters);
  } catch {
    return NextResponse.json({ error: 'An error occurred while processing the request' }, { status: 500 });
  }
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
        race: character.playable_race.name,
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
