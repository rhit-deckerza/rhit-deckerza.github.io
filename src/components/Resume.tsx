import React from 'react';
import { Container, Typography } from '@mui/material';

function Resume() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        RESUME
      </Typography>
      {/* Add your resume content here */}
    </Container>
  );
}

export default Resume;
