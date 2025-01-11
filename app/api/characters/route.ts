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
    const characters = await fetchCharacterDetails(bnetData, accessToken);

    return NextResponse.json(characters);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

async function fetchCharacterDetails(data: BlizzardData, accessToken: string): Promise<CharacterRealm[]> {
  const characters = extractCharacterAndRealm(data);

  const characterDetails = await Promise.all(
    characters.map(async (character) => {
      try {
        const mediaResponse = await fetch(
          `https://us.api.blizzard.com/profile/wow/character/${encodeURIComponent(character.realm.toLowerCase())}/${encodeURIComponent(character.name.toLowerCase())}/character-media?namespace=profile-us&locale=en_US`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          return {
            ...character,
            avatarUrl: mediaData.assets?.find((asset: { key: string }) => asset.key === 'avatar')?.value || null,
          };
        } else {
          console.warn(`Failed to fetch media for character ${character.name} on realm ${character.realm}`);
          return {
            ...character,
            avatarUrl: null,
          };
        }
      } catch (error) {
        console.error(`Error fetching media for character ${character.name} on realm ${character.realm}:`, error);
        return {
          ...character,
          avatarUrl: null,
        };
      }
    })
  );

  return characterDetails;
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
  avatarUrl?: string;
}

interface CharacterClass {
  name: string;
}

interface CharacterRace {
  name: string;
}
