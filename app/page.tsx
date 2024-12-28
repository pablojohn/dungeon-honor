import { auth } from "auth";
import SessionData from "./components/session-data";

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">WoW Behave</h1>
      <div>
        This is a site used to rate m+ teammates after playing with them.
      </div>
      <SessionData session={session} />
    </div>
  );
}
