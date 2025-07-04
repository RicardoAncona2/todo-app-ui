import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDrop } from 'react-dnd';

import DraggableTask from './DraggableTask';
import { Status, Task } from './TasksBoard';

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
  onEdit,
}: {
  title: string;
  status: Status;
  tasks: Task[];
  onDrop: (task: Task, newStatus: Status) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) => {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (task: Task) => onDrop(task, status),
  }));

  return (
    <Grid size={{ xs: 12, md: 4 }}>
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
