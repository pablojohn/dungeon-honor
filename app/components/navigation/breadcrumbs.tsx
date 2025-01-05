import Link from "next/link";

export default function Breadcrumbs() {
  return (
    <nav className="flex items-center text-sm text-gray-400">
      <Link href="/" className="hover:text-white">
        Home
      </Link>
      <span className="mx-1 text-gray-500">/</span>
      <Link href="/report" className="hover:text-white">
        Reports
      </Link>
    </nav>
  );
}
