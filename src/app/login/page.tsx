
import React from 'react';
import { Box, Container, Paper, Typography, } from '@mui/material';
import LoginForm from './LoginForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.accessToken) redirect('/tasks');
  return (
    <Box>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h2" >
            Log in
          </Typography>
          <LoginForm />
          <Link href="/register">
            Don't have an account? Register
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
