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

      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        flexWrap: 'wrap', 
        mb: 3 
      }}>
        {/* Regular Tags */}
        {project.tags && project.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            sx={{ 
              bgcolor: 'white', 
              color: 'black',
              border: '1px solid black',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          />
        ))}
        
        {/* Technical Tags */}
        {project.technologies && project.technologies.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            sx={{
              bgcolor: 'black', 
              color: 'white',
              fontWeight: 500,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.8)'
              }
            }}
          />
        ))}
      </Box>

      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
        {project.fullDescription}
      </Typography>

      <Paper elevation={0} sx={{ 
        p: 3, 
        border: '1px solid black',
        mb: 4,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }
      }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Key Features
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {project.features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                py: 1.25,
                px: 2.5,
                border: '1px solid black',
                borderRadius: 1,
                fontWeight: 400,
                fontSize: '0.95rem',
                textAlign: 'left'
              }}
            >
              {feature}
            </Box>
          ))}
        </Box>
      </Paper>

      {project.screenshots && project.screenshots.length > 0 && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          border: '1px solid black', 
          mb: 4,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }
        }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Screenshots
          </Typography>
          <Grid container spacing={3}>
            {project.screenshots.map((screenshot, index) => (
              <Grid 
                item 
                xs={12} 
                sm={project.screenshots.length === 1 ? 12 : 6} 
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    mb: 2,
                    position: 'relative',
                    maxWidth: project.screenshots.length === 1 ? '80%' : '100%',
                    mx: 'auto'
                  }}
                >
                  <Box
                    component="img"
                    src={screenshot.url}
                    alt={screenshot.caption}
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: project.screenshots.length === 1 ? '400px' : '280px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1.5,
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    {screenshot.caption}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Paper elevation={0} sx={{ 
        p: 3, 
        border: '1px solid black',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }
      }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Project Links
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {project.links.map((link) => (
            <Button 
              key={link.title}
              variant="outlined"
              size="medium"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                py: 1.25,
                px: 2.5,
                '&:hover': {
                  borderColor: 'black',
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
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