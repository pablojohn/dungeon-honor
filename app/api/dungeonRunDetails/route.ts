import { validateAuth } from "@/app/utils/sessionUtils";

export const config = {
  runtime: "edge",
};

interface Character {
  id: string;
  name: string;
  realm: string;
  role: string;
}

export async function GET(req: Request): Promise<Response> {
  const { errorResponse } = await validateAuth();

  if (errorResponse) {
    return errorResponse;
  }

  const url = new URL(req.url);
  const keystone_run_id = url.searchParams.get("keystone_run_id");
  const exclude_name = url.searchParams.get("exclude_name");
  const exclude_realm = url.searchParams.get("exclude_realm");

  if (!keystone_run_id) {
    return new Response(
      JSON.stringify({ error: '"keystone_run_id" query parameter is required.' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://raider.io/api/v1/mythic-plus/run-details?season=season-tww-1&id=${keystone_run_id}`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch dungeon run details from Raider.IO" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    if (!data.roster) {
      return new Response(
        JSON.stringify({ error: "Invalid response structure, no roster found." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const filteredData = {
      num_chests: data.num_chests,
      clear_time_ms: data.clear_time_ms,
      time_remaining_ms: data.time_remaining_ms,
      characters: data.roster
        .map((entry: { character: { id: string; name: string; realm: { name: string }; spec: { role: string } } }) => ({
          id: entry.character.id,
          name: entry.character.name,
          realm: entry.character.realm.name,
          role: entry.character.spec.role,
        }))
        .filter(
          (character: Character) =>
            !(character.name === exclude_name && character.realm === exclude_realm)
        ),
    };

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching dungeon run details:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
