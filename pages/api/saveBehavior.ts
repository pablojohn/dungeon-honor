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

  // Get IP address from X-Forwarded-For header
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "";

  if (ip) {
    // Hash the IP in order to not store it directly in your db.
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip)
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Deduplicate the IP for each slug and behavior
    const isNew = await redis.set(
      [`deduplicate`, hash, slug, behavior].join(":"),
      true,
      { nx: true, ex: 24 * 60 * 60 }
    );
    if (!isNew) {
      return new NextResponse(null, { status: 202 });
    }
  }

  // Increment behavior-specific counters
  await redis.incr([`wowbehave`, slug, behavior].join(":"));

  return new NextResponse("Behavior saved successfully", { status: 200 });
}
