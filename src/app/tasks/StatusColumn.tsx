import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDrop } from 'react-dnd';

import DraggableTask from './DraggableTask';
import { Task } from './TasksBoard';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 15,
  minHeight: 300,
}));

const ItemType = {
  TASK: 'task',
};

const StatusColumn = ({
  title,
  status,
  tasks,
  onDrop,
  onDelete,
  onEdit, // 🆕 Added
}: {
  title: string;
  status: string;
  tasks: Task[];
  onDrop: (task: Task, newStatus: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void; // 🆕 Added
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (task: Task) => onDrop(task, status),
  }));

  return (
    <Grid size={{ md: 12, xs: 4 }}>
      {drop(
        <div>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom align="center">
              {title}
            </Typography>
            {tasks.map((task) => (
              <DraggableTask
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </StyledPaper>
        </div>
      )}
    </Grid>
  );
};

export default StatusColumn;
