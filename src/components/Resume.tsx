import React from 'react';
import { Container } from '@mui/material';

function Resume() {
  return (
    <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 100px)' }}>
      <object
        data="resume.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <p>
          It appears your browser doesn't support PDFs.
          <a href="resume.pdf"> Download the PDF</a> instead.
        </p>
      </object>
    </Container>
  );
}

export default Resume;
