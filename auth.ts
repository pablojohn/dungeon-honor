import NextAuth from "next-auth"
import BattleNet from "next-auth/providers/battlenet";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  providers: [
    BattleNet({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: process.env.BATTLENET_ISSUER,
      authorization: { params: { 'scope': 'openid wow.profile' } }
    })
  ],
  basePath: "/auth",
  callbacks: {
    jwt({ token, account, user }) {
      if (account && account.access_token) {
        token.access_token = account.access_token
      }
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.access_token = token.access_token
      session.user.id = token.id
      return session;
    }
  }
})