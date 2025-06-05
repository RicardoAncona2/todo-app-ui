import { Box, Container, Paper, Typography } from '@mui/material';
import RegisterForm from './RegisterForm';
import styles from '../login/login.module.css';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/tasks');

  return (
    <Box className={styles.root}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={styles.paper}>
          <Typography variant="h2" gutterBottom className={styles.title}>
            Register
          </Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            Create your account to manage tasks.
          </Typography>
          <RegisterForm />
        </Paper>
      </Container>
    </Box>
  );
}
