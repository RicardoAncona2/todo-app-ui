import { Box, Container, Paper, Typography } from '@mui/material';
import LoginForm from './LoginForm';
import styles from './login.module.css';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/tasks');
  return (
    <Box className={styles.root}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h2" gutterBottom className={styles.title}>
            Log in
          </Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            Enter your credentials to access your tasks.
          </Typography>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
}