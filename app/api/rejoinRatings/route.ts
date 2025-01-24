import { Redis } from "@upstash/redis";
import { validateAuth } from "@/app/utils/sessionUtils";

const redis = Redis.fromEnv();

export const config = {
  runtime: "edge",
};

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const realm = url.searchParams.get("realm");

  if (!name || !realm) {
    return new Response(
      JSON.stringify({ error: 'Invalid or missing parameters. Both "name" and "realm" are required.' }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const prefix = `wowbehave:rejoin:${name}:${realm}:`;
    const keys = await redis.keys(`${prefix}*`);

    if (!keys || keys.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No records found for the given name and realm.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = keys.map((key) => {
      const parts = key.split(":");
      const newKey = parts.slice(3).join(":");
      return { key: newKey };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: "Records retrieved successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching records from Redis:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  const { errorResponse } = await validateAuth();

  if (errorResponse) {
    return errorResponse;
  }

  if (req.headers.get("Content-Type") !== "application/json") {
    return new Response("Must be JSON", { status: 400 });
  }

  const body = await req.json();
  const { slug, rating } = body;

  if (!slug || !rating) {
    return new Response("Slug or rejoin rating missing", { status: 400 });
  }

  try {
    await redis.incr([`wowbehave:rejoin`, slug, rating].join(":"));

    return new Response("Rejoin Rating saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error saving rejoin rating to Redis:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
