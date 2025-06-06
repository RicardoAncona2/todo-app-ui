import NextAuth from 'next-auth';
import { authOptions } from './';

export const { auth, signIn, signOut } = NextAuth(authOptions);
