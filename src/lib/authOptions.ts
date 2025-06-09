import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const graphqlApi = process.env.NEXT_PUBLIC_GRAPHQL_API;
        if (!graphqlApi) {
          console.error("Missing NEXT_PUBLIC_GRAPHQL_API");
          return null;
        }

        const res = await fetch(graphqlApi, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              mutation {
                login(input: { email: "${credentials?.email}", password: "${credentials?.password}" }) {
                  accessToken
                  refreshToken
                }
              }
            `,
          }),
        });

        const { data } = await res.json();

        if (data?.login?.accessToken) {
          return {
            id: "user-id",
            accessToken: data.login.accessToken,
            refreshToken: data.login.refreshToken,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "", // fallback to avoid crash during build
};
