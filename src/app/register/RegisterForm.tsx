'use client';

import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { REGISTER_MUTATION } from '@/graphql/';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [registerUser] = useMutation(REGISTER_MUTATION);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    clearErrors();

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      await registerUser({
        variables: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      router.push('/login');
    } catch (err) {
      setError('root', {
        type: 'server',
        message: (err instanceof Error && err.message) ? err.message : 'Registration failed',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        {...register('name', { required: 'Name is required' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('password', { required: 'Password is required' })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        {...register('confirmPassword', { required: 'Please confirm password' })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Box mt={2} mb={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>

      {errors.root && (
        <Alert severity="error" className={styles.error}>
          {errors.root.message}
        </Alert>
      )}
    </form>
  );
}
