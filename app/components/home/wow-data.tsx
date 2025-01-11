"use client";

import { useEffect, useState } from "react";
import { WoWCharacters } from "./wow-characters";

export default function WoWData({ userId }: { userId: string }) {
  interface Character {
    id: number;
    name: string;
    realm: string;
    class: string;
    race: string;
  }

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/characters");
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        setCharacters(await response.json());
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col gap-4 rounded-lg border border-red-500 bg-red-50 p-6 text-red-700">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z"
            />
          </svg>
          Error
        </h2>
        <p className="text-sm">We encountered an error while fetching your characters:</p>
        <pre className="whitespace-pre-wrap break-words bg-red-100 p-4 rounded-md">
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-lg bg-gray-800 p-4 sm:p-6 text-white shadow-lg">
      <h2 className="text-2xl font-bold text-center">
        Characters
        <span className="block text-lg font-normal text-gray-400">Select a character</span>
      </h2>
      <div className="flex flex-col rounded-md">
        <WoWCharacters characters={characters} userId={userId} />
      </div>
    </div>
  );
}
