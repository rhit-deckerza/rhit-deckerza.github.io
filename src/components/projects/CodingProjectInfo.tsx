import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CodingProject } from '../../utils/projectData';
import { fetchProjects } from '../../utils/projectData';

const CodingProjectInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CodingProject | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjects();
      if (id && data.coding[id]) {
        setProject(data.coding[id]);
      }
    };
    loadProject();
  }, [id]);

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        component={Link} 
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Portfolio
      </Button>

      <Typography variant="h3" component="h1" gutterBottom>
        {project.title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        {project.technologies.map((tech) => (
          <Chip 
            key={tech} 
            label={tech} 
            sx={{ 
              mr: 1, 
              mb: 1,
              bgcolor: 'black',
              color: 'white',
              borderRadius: '4px'
            }} 
          />
        ))}
      </Box>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
        {project.fullDescription}
      </Typography>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid black', mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Key Features
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {project.features.map((feature, index) => (
            <Box component="li" key={index} sx={{ mb: 1 }}>
              {feature}
            </Box>
          ))}
        </Box>
      </Paper>

      {project.screenshots.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid black', mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Screenshots
          </Typography>
          <Grid container spacing={2}>
            {project.screenshots.map((screenshot, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <img
                    src={screenshot.url}
                    alt={screenshot.caption}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {screenshot.caption}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid black' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Project Links
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {project.links.map((link) => (
            <Button 
              key={link.title}
              variant="outlined"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
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
              {link.title}
            </Button>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CodingProjectInfo; 