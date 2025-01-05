import { NextResponse } from 'next/server';
import { validateAuth } from "@/app/utils/sessionUtils";

export async function GET() {
  const { accessToken, errorResponse } = await validateAuth();

  if (errorResponse) {
    return errorResponse;
  }

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
      return NextResponse.json(
        { error: 'Failed to fetch characters from Battle.net' },
        { status: response.status }
      );
    }

    const bnetData = await response.json();
    const characters = extractCharacterAndRealm(bnetData);

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

function extractCharacterAndRealm(data: BlizzardData): CharacterRealm[] {
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
  id: number;
  name: string;
  realm: string;
  class: string;
  race: string;
}

interface CharacterClass {
  name: string;
}

interface CharacterRace {
  name: string;
}
