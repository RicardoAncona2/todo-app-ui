'use client';

import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import {
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { CREATE_TASK_MUTATION } from '@/graphql';
import { useState } from 'react';

interface FormValues {
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

type Props = {
  onSuccess?: () => void;
};

export default function CreateTaskForm({ onSuccess }: Props) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
    },
  });

  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await createTask({
        variables: {
          input: {
            title: data.title,
            description: data.description,
            status: data.status,
          },
        },
      });

      reset();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Create Task
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Status"
            fullWidth
            margin="normal"
          >
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </TextField>
        )}
      />

      <Box mt={2} textAlign="right">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </Box>
    </Box>
  );
}
