'use client';

import { useState, Suspense } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Box, Button, Typography, Grid, Modal } from '@mui/material';

import { READ_TASKS, UPDATE_TASK_MUTATION, DELETE_TASK } from '@/graphql';
import StatusColumn from './StatusColumn';
import ConfirmDialog from './ConfirmDialog';
import CreateTaskForm from './CreateTaskForm';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
};

export default function TasksBoard() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ myTasks: Task[] }>(READ_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK);

  const tasks = data?.myTasks ?? [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateTaskStatus = async (task: Task, newStatus: string) => {
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
        optimisticResponse: {
          updateTask: { ...task, status: newStatus },
        },
        update(cache, { data }) {
          if (!data?.updateTask) return;
          cache.modify({
            fields: {
              myTasks(existingTasksRefs = [], { readField }) {
                return existingTasksRefs.map((taskRef: any) => {
                  const id = readField('id', taskRef);
                  if (id === task.id) {
                    return cache.writeFragment({
                      data: data.updateTask,
                      fragment: gql`
                        fragment UpdatedTask on Task {
                          id
                          title
                          description
                          status
                        }
                      `,
                    });
                  }
                  return taskRef;
                });
              },
            },
          });
        },
      });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

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

  const pending = tasks.filter((task) => task.status === 'PENDING');
  const inProgress = tasks.filter((task) => task.status === 'IN_PROGRESS');
  const done = tasks.filter((task) => task.status === 'DONE');

  return (
    <>
      <Box textAlign="center" mb={4}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Create Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        <StatusColumn title="Pending" status="PENDING" tasks={pending} onDrop={updateTaskStatus} onDelete={handleDelete} />
        <StatusColumn title="In Progress" status="IN_PROGRESS" tasks={inProgress} onDrop={updateTaskStatus} onDelete={handleDelete} />
        <StatusColumn title="Done" status="DONE" tasks={done} onDrop={updateTaskStatus} onDelete={handleDelete} />
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
            <CreateTaskForm onSuccess={handleClose} />
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
