import { auth } from "auth";
import WoWData from "./components/home/wow-data";
import { isTokenExpired } from "./utils/sessionUtils";

export default async function Home() {
  const session = await auth();
  const isExpired = isTokenExpired(session?.expires_at);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dungeon Honor</h1>
      <div>A place used to rate teammate behavior in m+ dungeons.</div>

      {isExpired ? (
        <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-xl font-bold">Error</h2>
          <div className="flex flex-col rounded-md bg-neutral-100">
            <pre className="whitespace-pre-wrap break-all px-4 py-6">
              {"Your session has expired. Please log in again"}
            </pre>
          </div>
        </div>
      ) : (
        <WoWData
          accessToken={session?.access_token ?? ""}
          userId={session?.user?.id ?? ""}
        />
      )}
    </div>
  );
}
