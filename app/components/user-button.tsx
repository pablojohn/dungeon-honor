// import { auth } from "auth"
import SignInButton  from "./signin-button"

export default async function UserButton() {
    // const session = await auth();
    // if (!session?.user) return <SignInButton />
    if (true) return <SignInButton />
    return (
        <div className="flex items-center gap-2">
        </div>
    )
}