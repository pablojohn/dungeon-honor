import { signOut } from "auth";
import { Button } from "./button"

export default function SignOutButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={async () => {
      "use server"
      await signOut()
    }}>
      <Button {...props}>Sign out</Button>
    </form>
  )
}