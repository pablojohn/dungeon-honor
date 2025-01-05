import MobileNavToggle from "./mobile-nav-toggle";

interface MobileNavProps {
  username: string | null | undefined;
  isLoggedIn: boolean;
  onSignOut: () => void;
  onSignIn: () => void;
}

export default function MobileNav({ username, isLoggedIn, onSignOut, onSignIn, }: MobileNavProps) {
  return (
    <div className="sm:hidden">
      <MobileNavToggle
        username={username}
        isLoggedIn={isLoggedIn}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
      />
    </div>
  );
}
