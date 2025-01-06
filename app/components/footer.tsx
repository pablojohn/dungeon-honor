import CustomLink from "./shared/custom-link";
import { Coffee } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-gray-700 bg-gradient-to-t from-gray-900 to-gray-800 text-white py-6 px-4 sm:py-8 sm:px-12">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                {/* Left Section */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <CustomLink
                        href="https://github.com/pablojohn/dungeon-honor"
                        className="text-sm font-semibold hover:text-blue-400 transition-colors"
                    >
                        Source on GitHub
                    </CustomLink>
                    <CustomLink
                        href="https://paypal.me/pablojohnm?country.x=US&locale.x=en_US"
                        className="flex items-center text-sm font-semibold hover:text-blue-400 transition-colors"
                    >
                        <Coffee className="inline-block h-4 w-4" />
                        <span className="ml-2">Donate</span>
                    </CustomLink>
                </div>

                {/* Right Section */}
                <div className="text-center sm:text-right">
                    <CustomLink
                        href="https://pablojohn.dev"
                        className="text-sm font-semibold hover:text-blue-400 transition-colors"
                    >
                        Made by Pablojohn
                    </CustomLink>
                </div>
            </div>

            {/* Footer Credits */}
            <div className="mt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} Dungeon Honor. All rights reserved.
            </div>
        </footer>
    );
}
