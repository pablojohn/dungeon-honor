import CustomLink from "./shared/custom-link";
import { Coffee } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mx-0 my-4 flex w-full flex-col gap-4 px-4 text-sm sm:mx-auto sm:my-12 sm:h-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row">
                <CustomLink href="https://github.com/pablojohn/dungeon-honor">
                    Source on GitHub
                </CustomLink>
                <CustomLink href="https://paypal.me/pablojohnm?country.x=US&locale.x=en_US" className="flex items-center space-x-1">
                    <Coffee className="inline-block" />
                    <span className="ml-2">Donate</span>
                </CustomLink>
            </div>
            <div className="flex items-center justify-start gap-2">
                <CustomLink href="https://pablojohn.dev">
                    Made by Pablojohn
                </CustomLink>
            </div>
        </footer>
    );
}
