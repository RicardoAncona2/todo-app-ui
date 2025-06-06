import { authOptions } from '@/lib';
import NextAuth from 'next-auth';

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



const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
