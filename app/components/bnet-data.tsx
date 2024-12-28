"use client"
import { useEffect, useState } from 'react';

export default function BnetData({ accessToken }: { accessToken: string }) {
  const [characters, setCharacters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetch(`/api/getCharacters?access_token=${accessToken}`);
        if (!data.ok) {
          console.error('failed to fetch bneta data');
        }
        setCharacters(await data.json());
      } catch (err) {
        setError(err);
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
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
      <h2 className="text-xl font-bold">Battle.net Data</h2>
      <div className="flex flex-col rounded-md bg-neutral-100">
        <pre className="whitespace-pre-wrap break-all px-4 py-6">
          {JSON.stringify(characters, null, 2)}
        </pre>
      </div>
    </div>
  );
}