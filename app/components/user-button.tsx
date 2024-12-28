import { auth } from "auth"
import SignInButton from "./signin-button";
import SignOutButton from "./signout-button";

export default async function UserButton() {
    const session = await auth()
    if (!session?.user)
        return <SignInButton />
    else
        return (
            <div className="flex items-center gap2">
                <div className="flex flex-col space-y-1">
                    <p className="w-28 text-sm font-medium leading-none">{session.user.name}</p>
                </div>
                <SignOutButton />
            </div>

        )
}
