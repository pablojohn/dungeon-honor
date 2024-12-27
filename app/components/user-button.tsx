import { auth } from "auth"
import SignInButton  from "./signin-button"

export default async function UserButton() {
    const session = await auth();
    if (!session?.user) return <SignInButton />
    return (
        <div className="flex items-center gap-2">
            <span className="hidden text-sm sm:inline-flex">
                {session.user.email}
            </span>
            <p>{session.user.name}</p>
        </div>
    )
}