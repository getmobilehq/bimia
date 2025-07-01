import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const aiJokes = [
  "Why did the AI get lost? It couldn't find its route!",
  "404: Joke not found. But here's one: Why did the neural network stay home? It couldn't generalize!",
  "Why did the AI become an artist? It wanted to draw its own conclusions!",
  "Why did the AI fail its driving test? Too many crashes!",
  "Why did the AI get a timeout? It couldn't stop processing!"
];

function getRandomJoke() {
  return aiJokes[Math.floor(Math.random() * aiJokes.length)];
}

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f7' }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h4" color="error" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Sorry, the page you are looking for does not exist.<br />
          Try navigating back to the dashboard.
        </Typography>
        <Typography variant="subtitle1" color="secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
          AI Joke: {getRandomJoke()}
        </Typography>
        <Button href="/dashboard/manage" variant="contained" sx={{ mt: 3 }}>
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
