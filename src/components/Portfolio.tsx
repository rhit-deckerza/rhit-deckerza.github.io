import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './ui/MangaTheme.css';
import { ProjectsData, ResearchProject, CodingProject } from '../utils/projectData';
import { fetchProjects } from '../utils/projectData';

const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<ProjectsData>({
    research: {},
    coding: {}
  });

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" className="manga-title" gutterBottom>
          Zach Decker
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Software Developer & Engineer
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Under construction and still migrating projects. Will be complete by April 7th latest.
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
      {/* Coding Projects */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Coding Projects
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(projects.coding).map(([id, project]) => (
          <Grid item xs={12} md={6} key={id}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid black' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.technologies.map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/coding/${id}`}
                  size="small"
                  sx={{ 
                    boxShadow: 'none',
                    borderColor: 'black',
                    color: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  View Project
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Research Projects */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Research Projects
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(projects.research).map(([id, project]) => (
          <Grid item xs={12} md={6} key={id}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid black' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Typography variant="h6" component="h3" sx={{ mr: 1 }}>
                  {project.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1, alignItems: 'center', mt: 0.5 }}>
                  {/* Research Area Tags */}
                  {project.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small"
                      sx={{ 
                        bgcolor: 'black', 
                        color: 'white', 
                        borderRadius: '4px',
                        height: '24px'
                      }} 
                    />
                  ))}
                  {/* Technical Tags */}
                  {project.technicalTags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'black', 
                        border: '1px solid black',
                        borderRadius: '4px',
                        height: '24px'
                      }} 
                    />
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/research/${id}`}
                  size="small"
                  sx={{ 
                    boxShadow: 'none',
                    borderColor: 'black',
                    color: 'black',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  View Research
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      

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