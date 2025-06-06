'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      router.replace('/login?error=Invalid%20email%20or%20password');
    } else {
      router.replace('/tasks');
    }
  }

  return (
    <Box>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h2" gutterBottom>
            Log in
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" fullWidth margin="normal" required />
            <TextField label="Password" name="password" type="password" fullWidth margin="normal" required />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Log In
            </Button>
          </form>
        </Paper>          <Link href="/register">
            Don't have an account? Register
          </Link>
      </Container>
    </Box>
  );
}
