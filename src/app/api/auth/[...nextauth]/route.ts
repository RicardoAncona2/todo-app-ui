import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { NextAuthOptions } from 'next-auth';
// Module augmentation — ideally in a separate `next-auth.d.ts` file
declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}
export const authOptions= {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch('http://localhost:3000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            id: 'user-id',
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
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: "O6YuXrTSf7Y4v7rc+uNGlRwVhRiVLXzGp30QFbI5VGU=",
}
export const authConfig: NextAuthOptions =authOptions;

// Create the NextAuth handler with your config
const handler = NextAuth(authConfig);
export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

// **Important:** Export HTTP method handlers for Next.js App Router
export { handler as GET, handler as POST };
