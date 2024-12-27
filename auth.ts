import NextAuth from "next-auth";
import "next-auth/jwt";
import BattleNet from "next-auth/providers/battlenet";

const clientId = process.env.BATTLENET_CLIENT_ID || "";
const clientSecret = process.env.BATTLENET_CLIENT_SECRET || "";

const options = {
    debug: !!process.env.AUTH_DEBUG,
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    providers: [
        BattleNet({
            clientId,
            clientSecret,
            issuer: "https://us.battle.net/oauth"
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true; // Add your logic here
            if (isAllowedToSignIn) {
                return true;
            } else {
                return false;
            }
        },
        jwt({ token, trigger, session, account }) {
            if (trigger === "update") token.name = session.user.name
            if (account?.provider === "keycloak") {
                return { ...token, accessToken: account.access_token }
            }
            return token
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken as string
            return session;
        }
    }
};

export const { handlers, signIn, signOut } = NextAuth(options);

export async function auth() {
    const session = await NextAuth(options);
    return session;
}