import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center text-white">
      <Image
        src="/favicon.png" // Replace with your logo file path
        alt="Dungeon Honor Logo"
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="ml-2 text-lg font-bold tracking-tight">Dungeon Honor</span>
    </Link>
  );
}
