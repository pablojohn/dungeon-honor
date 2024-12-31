import { signIn } from "auth";
import { Button } from "../shared/button"

export default function SignInButton({
    provider,
    ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
    return (
        <form action={async () => {
            "use server"
            await signIn(provider)
        }}>
            <Button {...props}>Sign in with Battle.net</Button>
        </form>
    )
}