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
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from '@/graphql';
import { useState } from 'react';
import { Status } from './TasksBoard';

interface FormValues {
  title: string;
  description: string;
  status: Status;
}

type Props = {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    status:Status;
  };
};

export default function CreateTaskForm({ onSuccess, initialData }: Props) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'PENDING',
    },
  });

  const [createTask] = useMutation(CREATE_TASK_MUTATION);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const mutationFn = initialData?.id ? updateTask : createTask;
      const variables = initialData?.id
        ? { id: initialData.id, input: data }
        : { input: data };

      await mutationFn({
        variables,
        refetchQueries: ['ReadMyTasks'],
        awaitRefetchQueries: true,
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
        {initialData ? 'Edit Task' : 'Create Task'}
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
          <TextField {...field} select label="Status" fullWidth margin="normal">
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
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </Box>
    </Box>
  );
}
