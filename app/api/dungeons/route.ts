export const config = {
  runtime: "edge",
};

interface MythicPlusRun {
  dungeon: string;
  mythic_level: number;
  keystone_run_id: number;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const realm = url.searchParams.get("realm");

  if (!name || !realm) {
    return new Response(
      JSON.stringify({ error: 'Both "name" and "realm" query parameters are required.' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await fetch(
      `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_weekly_highest_level_runs`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch dungeons from Raider.IO" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    const reducedData = data.mythic_plus_weekly_highest_level_runs.map((run: MythicPlusRun) => ({
      name: run.dungeon,
      mythic_level: run.mythic_level,
      keystone_run_id: run.keystone_run_id,
    }));

    return new Response(JSON.stringify({ dungeons: reducedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching dungeons:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
