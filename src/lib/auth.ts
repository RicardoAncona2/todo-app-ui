import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const { auth, signIn, signOut } = NextAuth(authOptions);
