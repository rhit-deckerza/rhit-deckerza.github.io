import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid, Divider, Avatar } from '@mui/material';
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        variant="outlined" 
        component={Link} 
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ 
          mb: 5,
          borderColor: 'black',
          color: 'black',
          '&:hover': {
            borderColor: 'black',
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        Back to Portfolio
      </Button>

      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            letterSpacing: '-0.5px',
            mb: 3
          }}
        >
          {project.title}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap', 
          mb: 4
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
                borderRadius: '4px',
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
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
            />
          ))}
        </Box>

        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.125rem', 
            lineHeight: 1.7,
            maxWidth: '90ch',
            color: 'rgba(0, 0, 0, 0.87)'
          }}
        >
          {project.fullDescription}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/* Key Features Section */}
          <Paper elevation={0} sx={{ 
            p: 4, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            mb: 4,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              borderColor: 'rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: 'black'
                }
              }}
            >
              Key Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {project.features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    py: 2,
                    px: 3,
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: 1,
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    backgroundColor: 'rgba(0, 0, 0, 0.01)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {feature}
                </Paper>
              ))}
            </Box>
          </Paper>

          {/* Collaborators Section (Optional) */}
          {project.collaborators && project.collaborators.length > 0 && (
            <Paper elevation={0} sx={{ 
              p: 4, 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              mb: 4,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                borderColor: 'rgba(0, 0, 0, 0.3)'
              }
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '3px',
                    backgroundColor: 'black'
                  }
                }}
              >
                Collaborators
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                {project.collaborators.map((collaborator, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar>{collaborator.charAt(0)}</Avatar>}
                    label={collaborator}
                    variant="outlined"
                    sx={{
                      border: '1px solid rgba(0, 0, 0, 0.2)',
                      padding: '8px 4px',
                      height: 'auto',
                      '& .MuiChip-avatar': {
                        bgcolor: 'black',
                        color: 'white',
                        fontWeight: 'bold'
                      },
                      '& .MuiChip-label': {
                        padding: '0 8px',
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          {/* Workflow Section (if present) */}
          {project.workflow && project.workflow.length > 0 && (
            <Paper elevation={0} sx={{ 
              p: 4, 
              border: '1px solid rgba(0, 0, 0, 0.12)',
              mb: 4,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                borderColor: 'rgba(0, 0, 0, 0.3)'
              }
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '3px',
                    backgroundColor: 'black'
                  }
                }}
              >
                Workflow
              </Typography>
              <Box sx={{ mt: 3 }}>
                {project.workflow.map((step, index) => (
                  <Box key={index} sx={{ mb: 3, display: 'flex' }}>
                    <Box sx={{
                      mr: 3,
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'black',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      alignSelf: 'flex-start',
                      marginTop: '4px'
                    }}>
                      {index + 1}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {step.step}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                        {step.description}
                      </Typography>
                      {index < project.workflow.length - 1 && (
                        <Box sx={{ height: '20px', borderLeft: '1px dashed rgba(0,0,0,0.2)', ml: '15px', mt: 1 }} />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={5}>
          {/* Screenshots Section */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Paper elevation={0} sx={{ 
              p: 4, 
              border: '1px solid rgba(0, 0, 0, 0.12)', 
              mb: 4,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                borderColor: 'rgba(0, 0, 0, 0.3)'
              }
            }}>
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '3px',
                    backgroundColor: 'black'
                  }
                }}
              >
                Screenshots
              </Typography>
              <Box sx={{ mt: 3 }}>
                {project.screenshots.map((screenshot, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      mb: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src={screenshot.url}
                      alt={screenshot.caption}
                      sx={{ 
                        width: '100%', 
                        height: 'auto',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    />
                    <Box sx={{ 
                      p: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(0, 0, 0, 0.7)',
                          fontStyle: 'italic',
                          fontSize: '0.9rem'
                        }}
                      >
                        {screenshot.caption}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          )}

          {/* Project Links Section */}
          <Paper elevation={0} sx={{ 
            p: 4, 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              borderColor: 'rgba(0, 0, 0, 0.3)'
            }
          }}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: 'black'
                }
              }}
            >
              Project Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              {project.links.map((link) => (
                <Button 
                  key={link.title}
                  variant="outlined"
                  size="large"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    px: 3,
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    color: 'black',
                    fontWeight: 500,
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.03)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  {link.title}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CodingProjectInfo; 