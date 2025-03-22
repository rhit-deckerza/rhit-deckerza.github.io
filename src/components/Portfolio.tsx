import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './ui/MangaTheme.css';

const Portfolio: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" className="manga-title" gutterBottom>
          Zach Decker
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Software Developer & Engineer
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Welcome to my portfolio site.
        </Typography>
        {/* <Button 
          variant="contained" 
          color="primary"
          component={RouterLink} 
          to="/tools"
          size="large"
          sx={{ 
            boxShadow: 'none',
          }}
        >
          Explore My Tools
        </Button> */}
      </Box>

      {/* About Section */}
      {/* <Paper elevation={0} sx={{ p: 4, mb: 6, border: '1px solid black' }}>
        <Typography variant="h4" component="h2" className="manga-title" gutterBottom>
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
          I'm a software developer with a passion for creating tools that solve real problems. I specialize in full-stack development with a particular focus on user experience and clean, maintainable code.
        </Typography>
        <Typography variant="body1">
          My background in engineering has given me a methodical approach to problem-solving, allowing me to build robust applications that stand up to real-world use.
        </Typography>
      </Paper> */}

      {/* Coding Projects Section - Under Construction */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" className="manga-title" gutterBottom>
          Coding Projects
        </Typography>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid black', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Under Construction
          </Typography>
          <Typography variant="body1">
            My coding projects section is currently being updated. Please check back soon!
          </Typography>
        </Paper>
      </Box>

      {/* Research Projects Section - Under Construction */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" className="manga-title" gutterBottom>
          Research Projects
        </Typography>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid black', textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Under Construction
          </Typography>
          <Typography variant="body1">
            My research projects section is currently being updated. Please check back soon!
          </Typography>
        </Paper>
      </Box>

      {/* Tools Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" className="manga-title" gutterBottom>
          Tools
        </Typography>
        <Grid container spacing={3} sx={{ mt: -2 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid black' }}>
              <Typography variant="h6" gutterBottom>AI Resume Builder</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Streamlined tool for using LLMs to refine resumes.
              </Typography>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/tools/resumebuilder"
                size="small"
                sx={{ 
                  boxShadow: 'none',
                  mt: 1
                }}
              >
                View Project
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid black' }}>
              <Typography variant="h6" gutterBottom>ZIP to Context</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                A specialized tool that converts project ZIP files into formatted context for use with LLMs like ChatGPT.
              </Typography>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/tools/ziptocontext"
                size="small"
                sx={{ 
                  boxShadow: 'none',
                  mt: 1
                }}
              >
                View Project
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Contact Section */}
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center', border: '1px solid black', mt: 6 }}>
        <Typography variant="h4" component="h2" className="manga-title" gutterBottom>
          Get In Touch
        </Typography>
        <Typography variant="body1" paragraph>
          Interested in collaborating or have questions about my work?
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          href="mailto:zad25@cornell.edu"
          sx={{ 
            boxShadow: 'none',
          }}
        >
          Contact Me
        </Button>
      </Paper>
    </Container>
  );
};

export default Portfolio; 