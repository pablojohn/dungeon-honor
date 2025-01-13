import { Redis } from "@upstash/redis";
import { validateAuth } from "@/app/utils/sessionUtils";

const redis = Redis.fromEnv();

export const config = {
  runtime: "edge",
};

export async function GET(req: Request): Promise<Response> {
  const { errorResponse } = await validateAuth();

  if (errorResponse) {
    return errorResponse;
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid or missing parameters. Slug is required.',
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const pattern = `*${slug}*`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cursor, keys] = await redis.scan(0, {
      match: pattern,
      count: 100, // Adjust as needed
    });

    if (keys.length === 0) {
      return new Response(
        JSON.stringify({
          success: false
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({
        success: true
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching keys from Redis:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal Server Error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
