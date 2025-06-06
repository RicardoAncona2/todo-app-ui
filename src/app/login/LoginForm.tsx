import { Button, TextField, Box, Alert } from '@mui/material';
import styles from './login.module.css';
import { handleLogin } from './actions';

export default function LoginForm({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams?.error||"err";

  return (
    <form action={handleLogin} className={styles.form}>
      <TextField
        name="email"
        type="email"
        label="Email"
        variant="outlined"
        margin="normal"
        fullWidth
        required
      />
      <TextField
        name="password"
        type="password"
        label="Password"
        variant="outlined"
        margin="normal"
        fullWidth
        required
      />
      <Box mt={2} mb={2}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </Box>
      {error && (
        <Alert severity="error" className={styles.error}>
          {error}
        </Alert>
      )}
    </form>
  );
}
