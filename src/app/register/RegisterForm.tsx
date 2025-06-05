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
import { useState } from 'react';
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
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [registerUser, { loading }] = useMutation(REGISTER_MUTATION);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
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
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <>
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>
      </form>

      {error && (
        <Alert severity="error" className={styles.error}>
          {error}
        </Alert>
      )}
    </>
  );
}
