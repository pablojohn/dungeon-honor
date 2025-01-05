import { auth } from "auth";
import SignInButton from "./signin-button";
import SignOutButton from "./signout-button";
import { isTokenExpired } from "../../utils/sessionUtils";

export default async function DesktopNav() {
    const session = await auth();
    const isExpired = isTokenExpired(session?.expires_at);

    if (!session?.user || isExpired) {
        return <SignInButton />;
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col space-y-1">
                <p className="w-28 text-sm font-medium leading-none text-white">
                    {session.user.name}
                </p>
            </div>
            <SignOutButton />
        </div>
    );
}
