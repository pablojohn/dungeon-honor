import { signIn } from "../../auth"

export default function SignInButton() {
    return (
        <form action={async () => {
            "use server"
            await signIn("battlenet")
        }}>
            <button>Sign In</button>
        </form>
    )
}