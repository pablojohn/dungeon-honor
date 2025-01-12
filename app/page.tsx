import { auth } from "auth";
import WoWData from "./components/home/wow-data";
import { isTokenExpired } from "./utils/sessionUtils";

export default async function Home() {
  const session = await auth();
  const isExpired = isTokenExpired(session?.expires_at);

  return (
    <div className="container sm:container mx-auto flex flex-col gap-8 px-0 sm:px-2 py-12 text-center md:gap-12 max-w-full">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Dungeon Honor
      </h1>
      <p className="text-lg text-gray-300">
        Rate teammate behavior in Mythic+ dungeons.
      </p>

      {isExpired ? (
        <div className="flex flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 p-6 text-gray-300">
          <h2 className="text-2xl font-bold">Log In Required</h2>
          <p className="text-sm text-gray-400">Log in to rate your teammates.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg border border-gray-700 bg-gray-800 pt-6 text-gray-300">
          <WoWData userId={session?.user?.name ?? ""} />
        </div>
      )}
    </div>
  );
}
