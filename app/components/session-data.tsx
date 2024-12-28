import React from "react";
import type { Session } from "next-auth"

export default function SessionData({ session }: { session: Session | null }) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-md bg-gray-100 p-4">
      <h2 className="text-xl font-bold">Current Session Data</h2>
      <div className="flex flex-col rounded-md bg-neutral-100">
        <pre className="whitespace-pre-wrap break-all px-4 py-6">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  )
}