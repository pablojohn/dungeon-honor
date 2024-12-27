import { signIn } from "auth";
import { Button } from "./button"

export default function SignInButton({
    provider,
    ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
    return (
        <form action={async () => {
            "use server"
            await signIn(provider)
        }}>
            <Button {...props}>Signin with Battle.net</Button>
        </form>
    )
}