import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const aiJokes = [
  "Why did the AI go to therapy? It had too many neural issues!",
  "Why did the robot get a job? Because it had too many bytes to pay!",
  "How does an AI tell a joke? With machine punning!",
  "Why was the AI bad at relationships? It kept losing its 'connection'.",
  "Why did the AI cross the road? To optimize its pathfinding algorithm!"
];

function getRandomJoke() {
  return aiJokes[Math.floor(Math.random() * aiJokes.length)];
}

export default function RestrictedPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f7' }}>
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h4" color="error" gutterBottom>
          🚫 Restricted Access
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page is for internal use only.<br />
          Please contact your admin if you believe this is a mistake.
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
