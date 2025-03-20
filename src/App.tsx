import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import ZipToContext from './components/ZipToContext';
import Resume from './components/Resume';
import ResumeBuilder from './components/ResumeBuilder';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Resume
          </Button>
          <Button color="inherit" component={Link} to="/ziptocontext">
            ZIP to Context
          </Button>
          <Button color="inherit" component={Link} to="/resumebuilder">
            Resume Builder
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Resume />} />
        <Route path="/ziptocontext" element={<ZipToContext />} />
        <Route path="/resumebuilder" element={<ResumeBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;