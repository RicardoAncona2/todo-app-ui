import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // 🆕
import { useDrag } from 'react-dnd';

import { Task } from './TasksBoard';

const ItemType = {
  TASK: 'task',
};

const DraggableTask = ({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { ...task },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return drag(
    <div>
      <Box
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

        <IconButton
          onClick={() => onEdit(task)} // 🆕
          size="small"
          sx={{ position: 'absolute', top: 4, right: 36 }} // ⬅ space left of delete
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <Typography variant="subtitle1" fontWeight={600}>
          {task.title}
        </Typography>
        <Typography variant="body2">{task.description}</Typography>
      </Box>
    </div>
  );
};

export default DraggableTask;
