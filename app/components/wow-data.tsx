"use client"
import { useEffect, useState } from 'react';
import { WoWCharacters } from './wow-characters';

export default function WoWData({ accessToken, userId }: { accessToken: string, userId: string }) {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      setError(new Error("Not logged into Battle.net"));
      return;
    }

    async function fetchData() {
      try {
        const bnetData = await fetch(`/api/getCharacters?access_token=${accessToken}`);
        setCharacters(await bnetData.json());
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [accessToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
        <h2 className="text-xl font-bold">Characters</h2>
        <div className="flex flex-col rounded-md bg-neutral-100">
          <pre className="whitespace-pre-wrap break-all px-4 py-6">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
        <h2 className="text-xl font-bold">Characters - <span className="text-base font-normal">Select a character</span></h2>
        <div className="flex flex-col rounded-md bg-neutral-100">
          <WoWCharacters characters={characters} userId={userId} />
        </div>
      </div>
    </div>
  );
}
