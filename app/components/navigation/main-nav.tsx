import Link from "next/link";
import { House, StickyNote } from "lucide-react";

export default function MainNav() {
    return (
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-200 transition">
                <House />
                <span className="ml-1">Home</span>
            </Link>
            <Link href="/report" className="flex items-center p-2 rounded hover:bg-gray-200 transition">
                <StickyNote />
                <span className="ml-1">Reports</span>
            </Link>
        </div>
    );
}
