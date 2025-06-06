'use client';

import { Box, Container, Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function TaskLayout({ children }: { children: React.ReactNode }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ backgroundColor: '#f3f4f6', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="h3" align="center" color="primary" gutterBottom>
                        Task Board
                    </Typography>
                    {children}
                </Container>
            </Box>
        </DndProvider>
    );
}