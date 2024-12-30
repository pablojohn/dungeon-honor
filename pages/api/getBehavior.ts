import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
export const config = {
  runtime: "edge",
};

export default async function GetBehavior(req: Request) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use GET.' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  const realm = url.searchParams.get('realm');

  if (!name || !realm) {
    return new Response(
      JSON.stringify({ error: 'Invalid or missing parameters. Both "name" and "realm" are required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const prefix = `wowbehave:${name}:${realm}:`;
    const keys = await redis.keys(`${prefix}*`);

    if (!keys || keys.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No records found for the given name and realm.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const records = await Promise.all(keys.map((key) => redis.get(key)));
    const result = keys.map((key, index) => ({ key, value: records[index] }));

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: 'Records retrieved successfully.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching records from Redis:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal Server Error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
