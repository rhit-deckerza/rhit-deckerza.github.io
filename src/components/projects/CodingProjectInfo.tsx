import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CodingProject } from '../../utils/projectData';
import { fetchProjects } from '../../utils/projectData';

const CodingProjectInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CodingProject | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjects();
      if (id && data.coding[id]) {
        setProject(data.coding[id]);
        if (data.coding[id].screenshots && data.coding[id].screenshots.length > 0) {
          setSelectedImage(0);
        }
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
      <Box sx={{ mb: 5 }}>
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
      </Box>

      {/* Screenshots Section - Enhanced for better display */}
      {project.screenshots && project.screenshots.length > 0 && (
        <Box sx={{ 
          mb: 7, 
          width: '100%',
        }}>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: 4,
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
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
            {/* Main Screenshot Display */}
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                mb: 3,
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                backgroundColor: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                }
              }}
            >
              {selectedImage !== null && project.screenshots[selectedImage] && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: {
                      xs: '300px',
                      sm: '350px',
                      md: project.screenshots.length > 1 ? '400px' : '500px'
                    },
                    padding: {
                      xs: '10px',
                      sm: '15px',
                      md: '20px'
                    },
                    backgroundColor: 'white',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    component="img"
                    src={project.screenshots[selectedImage].url}
                    alt={project.screenshots[selectedImage].caption}
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}
                  />
                </Box>
              )}
              <Box sx={{ 
                p: { xs: 2, sm: 2.5, md: 3 },
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.87)',
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
                    textAlign: 'center',
                    fontStyle: 'italic',
                    fontWeight: selectedImage !== null ? 400 : 'inherit',
                    lineHeight: 1.6,
                    maxWidth: '800px',
                    mx: 'auto'
                  }}
                >
                  {selectedImage !== null && project.screenshots[selectedImage] 
                    ? project.screenshots[selectedImage].caption 
                    : ''}
                </Typography>
              </Box>
            </Paper>
            
            {/* Thumbnail Navigation (only show if more than one screenshot) */}
            {project.screenshots.length > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 1.5, md: 2 },
                mt: 2,
                mb: 1,
                width: '100%',
                padding: { xs: '0 10px', sm: '0 15px', md: '0 20px' }
              }}>
                {project.screenshots.map((screenshot, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: { xs: '70px', sm: '85px', md: '100px' },
                      height: { xs: '50px', sm: '65px', md: '75px' },
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImage === index ? '3px solid black' : '1px solid rgba(0, 0, 0, 0.15)',
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.7,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      },
                      '&:after': selectedImage === index ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        backgroundColor: 'black'
                      } : {}
                    }}
                  >
                    <Box
                      component="img"
                      src={screenshot.url}
                      alt={`Thumbnail ${index+1}`}
                      sx={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Project Description */}
      <Paper elevation={0} sx={{ 
        p: 4,
        mb: 5,
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
          About This Project
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: '1.125rem', 
            lineHeight: 1.7,
            color: 'rgba(0, 0, 0, 0.87)'
          }}
        >
          {project.fullDescription}
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/* Key Takeaways Section (renamed from Key Features) */}
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
              Key Takeaways
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
        </Grid>
        
        <Grid item xs={12} md={5}>
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