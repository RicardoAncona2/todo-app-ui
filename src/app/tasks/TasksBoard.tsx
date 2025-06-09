'use client';

import { useState, Suspense } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Typography,
  Grid,
  Modal,
} from '@mui/material';

import { READ_TASKS, UPDATE_TASK_MUTATION, DELETE_TASK } from '@/graphql';
import StatusColumn from './StatusColumn';
import ConfirmDialog from './ConfirmDialog';
import CreateTaskForm from './CreateTaskForm';

export type Status = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
};

export default function TasksBoard() {
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<{ myTasks: Task[] }>(READ_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK);

  const tasks = data?.myTasks ?? [];

  // Modal handlers
  const handleOpen = () => {
    setEditTask(null);
    setOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
  };

  // Task status update handler (e.g. drag & drop)
  const updateTaskStatus = async (task: Task, newStatus: Status) => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          input: {
            title: task.title,
            description: task.description,
            status: newStatus,
          },
        },
        // Optimistic UI update for instant UI feedback
        optimisticResponse: {
          updateTask: {
            __typename: 'Task',
            id: task.id,
            title: task.title,
            description: task.description,
            status: newStatus,
          },
        },
        // Refetch to keep server and cache in sync after mutation finishes
        refetchQueries: ['ReadMyTasks'],
        awaitRefetchQueries: true,
      });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };


  // Delete flow
  const handleDelete = (id: string) => {
    setTaskToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask({
        variables: { id: taskToDelete },
        update(cache) {
          cache.modify({
            fields: {
              myTasks(existingTasksRefs = [], { readField }) {
                return existingTasksRefs.filter(
                  (taskRef: any) => taskToDelete !== readField('id', taskRef)
                );
              },
            },
          });
        },
      });
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (error) return <Typography align="center" color="error">Error loading tasks</Typography>;

  return (
    <>
      <Box textAlign="center" mb={4}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {(['PENDING', 'IN_PROGRESS', 'DONE'] as Status[]).map((status) => (
          <StatusColumn
            key={status}
            title={status.replace('_', ' ')}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onDrop={updateTaskStatus}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Suspense fallback={<Typography align="center">Loading form...</Typography>}>
            <CreateTaskForm
              initialData={editTask || undefined}
              onSuccess={handleClose}
            />
          </Suspense>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
