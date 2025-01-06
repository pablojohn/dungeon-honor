import Link from "next/link";
import { Shield } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center text-white">
      <div className="relative w-8 h-8">
        <Shield
          className="absolute top-0 left-0 text-white"
          style={{
            width: "100%", // Shield takes full size
            height: "100%",
          }}
        />
      </div>
      <span className="ml-2 text-lg font-bold tracking-tight">Dungeon Honor</span>
    </Link>
  );
}
