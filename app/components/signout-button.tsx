import { signOut } from "auth";
import { Button } from "./button"

export default function SignOutButton(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={async () => {
      "use server"
      await signOut()
    }}
      className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign out
      </Button>
    </form>
  )
}