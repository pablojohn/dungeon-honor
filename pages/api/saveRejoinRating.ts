import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
export const config = {
  runtime: "edge",
};

export default async function SaveRejoinRating(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return new NextResponse("Use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new NextResponse("Must be JSON", { status: 400 });
  }

  const body = await req.json();
  const { slug, rating } = body;

  if (!slug || !rating) {
    return new NextResponse("Slug or rejoin rating missing", { status: 400 });
  }

  // Increment rejoinRating-specific counters
  await redis.incr([`wowbehave:rejoin`, slug, rating].join(":"));

  return new NextResponse("Rejoin Rating saved successfully", { status: 200 });
}