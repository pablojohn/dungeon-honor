import { auth } from "auth";
import WoWData from "./components/wow-data";

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">WoW Behave</h1>
      <div>
        A place used to rate teammate behavior in m+ dungeons.
      </div>
      <WoWData accessToken={session?.access_token ?? ""} userId={session?.user?.id ?? ""} />
    </div>
  );
}