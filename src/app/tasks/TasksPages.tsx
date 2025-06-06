'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Modal,
  Typography,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from 'react-dnd';

import { READ_TASKS, UPDATE_TASK_MUTATION, DELETE_TASK } from '@/graphql';
import CreateTaskForm from './CreateTaskForm';

const ItemType = {
  TASK: 'task',
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  minHeight: 300,
}));

const DraggableTask = ({ task, onDelete }: { task: any; onDelete: (id: string) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { ...task },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <Box
      ref={drag}
      sx={{
        mb: 2,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 1,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      <IconButton
        onClick={() => onDelete(task.id)}
        size="small"
        sx={{ position: 'absolute', top: 4, right: 4 }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Typography variant="subtitle1" fontWeight={600}>
        {task.title}
      </Typography>
      <Typography variant="body2">{task.description}</Typography>
    </Box>
  );
};

const StatusColumn = ({
  title,
  status,
  tasks,
  onDrop,
  onDelete,
}: {
  title: string;
  status: string;
  tasks: any[];
  onDrop: (task: any, newStatus: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (task: any) => onDrop(task, status),
  }));

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <div ref={drop}>
        <StyledPaper elevation={3}>
          <Typography variant="h6" gutterBottom align="center">
            {title}
          </Typography>
          {tasks.map((task) => (
            <DraggableTask key={task.id} task={task} onDelete={onDelete} />
          ))}
        </StyledPaper>
      </div>
    </Grid>
  );
};

export default function TasksPageClient() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  const { data, loading, error } = useQuery(READ_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK);

  useEffect(() => {
    if (data?.myTasks && tasks.length === 0) {
      setTasks(data.myTasks);
    }
  }, [data?.myTasks]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateTaskStatus = async (task: any, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

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
      });
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask({ variables: { id } });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task', err);
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
    </>
  );
}
