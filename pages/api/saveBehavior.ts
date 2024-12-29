import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
export const config = {
  runtime: "edge",
};

export default async function SaveBehavior(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return new NextResponse("Use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new NextResponse("Must be JSON", { status: 400 });
  }

  const body = await req.json();
  const { slug, behavior } = body;

  if (!slug || !behavior) {
    return new NextResponse("Slug or behavior missing", { status: 400 });
  }

  // Increment behavior-specific counters
  await redis.incr([`wowbehave`, slug, behavior].join(":"));

  return new NextResponse("Behavior saved successfully", { status: 200 });
}
