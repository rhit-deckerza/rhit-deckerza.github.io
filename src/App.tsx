import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material';
import ZipToContext from './components/tools/ziptocontext/ZipToContext';
import Portfolio from './components/Portfolio';
import ResumeBuilder from './components/tools/resumebuilder/ResumeBuilder';
import ResearchProjectInfo from './components/projects/ResearchProjectInfo';
import CodingProjectInfo from './components/projects/CodingProjectInfo';

// Navigation bar for the portfolio site
const NavigationBar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'black', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white', mr: 4 }}>
            Zach Decker
          </Typography>
        </Box>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/tools">
            Tools
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Component for the Tools page
const Tools = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" className="manga-title" gutterBottom>
        Developer Tools
      </Typography>
      
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="body1" paragraph>
          A collection of tools I've built to help with development and productivity.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ 
          border: '1px solid black', 
          borderRadius: '0px', 
          p: 3, 
          width: '300px',
          textAlign: 'center',
          boxShadow: 'none'
        }}>
          <Typography variant="h6" gutterBottom>Resume Builder</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Create and format professional resumes with our interactive builder.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={Link} 
            to="/tools/resumebuilder"
            sx={{ 
              boxShadow: 'none',
            }}
          >
            Open Tool
          </Button>
        </Box>
        
        <Box sx={{ 
          border: '1px solid black', 
          borderRadius: '0px', 
          p: 3, 
          width: '300px',
          textAlign: 'center',
          boxShadow: 'none'
        }}>
          <Typography variant="h6" gutterBottom>ZIP to Context</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Convert ZIP files into context for Large Language Models.
          </Typography>
          <Button 
            variant="contained"
            color="primary" 
            component={Link} 
            to="/tools/ziptocontext"
            sx={{ 
              boxShadow: 'none',
            }}
          >
            Open Tool
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/ziptocontext" element={<ZipToContext />} />
          <Route path="/tools/resumebuilder" element={<ResumeBuilder />} />
          
          {/* Project Info Routes */}
          <Route path="/research/:projectId" element={<ResearchProjectInfo />} />
          <Route path="/projects/:projectId" element={<CodingProjectInfo />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/ziptocontext" element={<ZipToContext />} />
          <Route path="/resumebuilder" element={<ResumeBuilder />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;