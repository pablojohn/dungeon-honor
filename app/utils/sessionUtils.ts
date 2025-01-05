import { auth } from 'auth';
import { NextResponse } from 'next/server';

export async function validateAuth() {
  const session = await auth();
  const accessToken = session?.access_token;

  if (!accessToken) {
    return {
      accessToken: null,
      errorResponse: NextResponse.json(
        { error: 'Not logged in' },
        { status: 400 }
      ),
    };
  }

  return { accessToken, errorResponse: null };
}

export function isTokenExpired(expiresAt: number | undefined): boolean {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return expiresAt ? currentTime > expiresAt : true; // Default to expired if expiresAt is missing
}
