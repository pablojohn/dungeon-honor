import NextAuth from "next-auth"
import BattleNet from "next-auth/providers/battlenet";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    BattleNet({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: process.env.BATTLENET_ISSUER
    })
  ],
  basePath: "/auth",
  callbacks: {
    jwt({ token, account }) {
      if (account && account.access_token) {
        token.access_token = account.access_token
      }
      return token
    }
  }
})