'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, TextField, Box, Alert, CircularProgress } from '@mui/material';
import styles from './login.module.css';
import { signIn } from 'next-auth/react';

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    clearErrors();

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError('root', {
        type: 'server',
        message: res.status === 401 ? "invalid credentials" : 'Login failed',
      });
    } else if (res?.ok) {
      router.push('/tasks');
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
      <Box mt={2} mb={2}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>
      {(errors.root) && (
        <Alert severity="error" className={styles.error}>
          {errors.root?.message}
        </Alert>
      )}
    </form>
  );
}
