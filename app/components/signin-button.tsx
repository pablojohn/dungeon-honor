// import { signIn } from "../../auth"

export default function SignInButton() {
    return (
        <form action={async () => {
            "use server"
        }}>
            <button>Sign In</button>
        </form>
    )
}