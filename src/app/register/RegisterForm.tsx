import Form from 'next/form';
import { registerUser } from './actions';
import {
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import styles from './register.module.css';

export default function RegisterPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error;

  return (
    <Form action={registerUser}>
      <TextField
        name="name"
        label="Name"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        fullWidth
        required
        margin="normal"
      />

      <Box mt={2} mb={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={styles.submitButton}
        >
          Register
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className={styles.error}>
          {decodeURIComponent(error)}
        </Alert>
      )}
    </Form>
  );
}
