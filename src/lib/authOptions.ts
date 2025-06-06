import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const graphqlApi = process.env.NEXT_PUBLIC_GRAPHQL_API;
const authSecret = process.env.NEXTAUTH_SECRET;

if (!graphqlApi) {
  throw new Error('Missing NEXT_PUBLIC_GRAPHQL_API in environment variables');
}
if (!authSecret) {
  throw new Error('Missing NEXTAUTH_SECRET in environment variables');
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(graphqlApi, {
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

          const { data, errors } = await res.json();

          if (errors || !data?.login?.accessToken) {
            console.error('Login error:', errors || data);
            return null;
          }

          return {
            id: 'user-id',
            accessToken: data.login.accessToken,
            refreshToken: data.login.refreshToken,
          };
        } catch (err) {
          console.error('Authorize exception:', err);
          return null;
        }
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
  secret: authSecret,
};
