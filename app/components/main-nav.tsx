import Link from "next/link";
import { House } from "lucide-react";

export default function MainNav() {
    return (
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-200 transition">
                <House />
            </Link>
        </div>
    );
}
