import { auth, signOut, signIn } from "auth";
import Logo from "./navigation/logo";
import Breadcrumbs from "./navigation/breadcrumbs";
import MobileNav from "./navigation/mobile-nav";
import DesktopNav from "./navigation/desktop-nav";
import { isTokenExpired } from "../utils/sessionUtils";

export default async function Header() {
    const session = await auth();
    const isLoggedIn = session?.user != null && !isTokenExpired(session?.expires_at);
    const username = isLoggedIn ? session?.user?.name : null;

    const handleSignOut = async () => {
        "use server";
        await signOut();
    };

    const handleSignIn = async () => {
        "use server";
        await signIn();
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">

                <div className="flex items-center gap-4 sm:gap-6">
                    <Logo />
                    <div className="hidden sm:flex">
                        <Breadcrumbs />
                    </div>
                </div>

                <MobileNav
                    username={username}
                    isLoggedIn={isLoggedIn}
                    onSignOut={handleSignOut}
                    onSignIn={handleSignIn}
                />

                <div className="hidden sm:flex">
                    <DesktopNav />
                </div>
            </div>
        </header>
    );
}
