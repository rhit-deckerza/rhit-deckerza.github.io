import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid, Avatar, useTheme, useMediaQuery, Modal, IconButton, Dialog } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { CodingProject } from '../../utils/projectData';
import { fetchProjects } from '../../utils/projectData';

const CodingProjectInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CodingProject | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handlePrevImage = () => {
    if (!project || !project.screenshots) return;
    setSelectedImage(prev => 
      prev === null ? null : (prev === 0 ? project.screenshots.length - 1 : prev - 1)
    );
  };

  const handleNextImage = () => {
    if (!project || !project.screenshots) return;
    setSelectedImage(prev => 
      prev === null ? null : (prev === project.screenshots.length - 1 ? 0 : prev + 1)
    );
  };

  const handleOpenLightbox = () => {
    setOpenLightbox(true);
  };

  const handleCloseLightbox = () => {
    setOpenLightbox(false);
  };

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button 
        variant="outlined" 
        component={Link} 
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ 
          mb: 2,
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
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '2.25rem', md: '3rem' },
            lineHeight: 1.2
          }}
        >
          {project.title}
        </Typography>

        {/* Project Date */}
        {project.date && (
          <Typography 
            variant="subtitle1"
            sx={{ 
              mb: 2,
              fontWeight: 500,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            {project.date.season} {project.date.year}
          </Typography>
        )}

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
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {/* Main Content Section */}
        <Grid item xs={12} md={7}>
          {/* Description */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2.5, md: 3.5 }, 
              border: '1px solid black',
              mb: { xs: 3, md: 4 },
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }
            }}
          >
            <Typography 
              variant="body1" 
              paragraph
              sx={{ 
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.05rem' }
              }}
            >
              {project.fullDescription}
            </Typography>
          </Paper>

          {/* Screenshots Section */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2.5, md: 3.5 }, 
                border: '1px solid black',
                mb: { xs: 3, md: 4 },
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  fontSize: { xs: '1.4rem', md: '1.5rem' }
                }}
              >
                Screenshots
              </Typography>
              
              {/* Main Featured Image */}
              {selectedImage !== null && (
                <Box 
                  sx={{ 
                    mb: 4, 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {/* Left Arrow */}
                    {project.screenshots.length > 1 && (
                      <IconButton 
                        onClick={handlePrevImage}
                        sx={{ 
                          position: 'absolute', 
                          left: 0, 
                          zIndex: 1,
                          color: 'black',
                          bgcolor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                      >
                        <ArrowBackIosNewIcon />
                      </IconButton>
                    )}

                    {/* Main Image */}
                    <Box
                      sx={{ 
                        maxWidth: '80%',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={handleOpenLightbox}
                    >
                      <Box
                        component="img"
                        src={project.screenshots[selectedImage].url}
                        alt={project.screenshots[selectedImage].caption}
                        sx={{ 
                          width: '100%', 
                          maxHeight: '400px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                      
                      {/* Fullscreen Button */}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          bgcolor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                        onClick={handleOpenLightbox}
                      >
                        <FullscreenIcon />
                      </IconButton>
                    </Box>

                    {/* Right Arrow */}
                    {project.screenshots.length > 1 && (
                      <IconButton 
                        onClick={handleNextImage}
                        sx={{ 
                          position: 'absolute', 
                          right: 0, 
                          zIndex: 1,
                          color: 'black',
                          bgcolor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                      >
                        <ArrowForwardIosIcon />
                      </IconButton>
                    )}
                  </Box>
                  
                  {/* Caption for main image */}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mt: 2,
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}
                  >
                    {project.screenshots[selectedImage].caption}
                  </Typography>
                </Box>
              )}
              
              {/* Thumbnail Grid */}
              {project.screenshots.length > 1 && (
                <Grid container spacing={2}>
                  {project.screenshots.map((screenshot, index) => (
                    <Grid 
                      item 
                      xs={6} 
                      sm={4} 
                      md={3} 
                      key={index}
                    >
                      <Box 
                        sx={{ 
                          cursor: 'pointer',
                          opacity: selectedImage === index ? 1 : 0.6,
                          border: selectedImage === index ? '2px solid black' : 'none',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            opacity: 1,
                            transform: 'scale(1.05)'
                          }
                        }}
                        onClick={() => setSelectedImage(index)}
                      >
                        <Box
                          component="img"
                          src={screenshot.url}
                          alt={screenshot.caption}
                          sx={{ 
                            width: '100%', 
                            height: '80px',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          )}
        </Grid>

        {/* Sidebar Section */}
        <Grid item xs={12} md={5}>
          {/* Key Features */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2.5, md: 3.5 }, 
              border: '1px solid black',
              mb: { xs: 3, md: 4 },
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                mb: 3,
                fontWeight: 600,
                fontSize: { xs: '1.4rem', md: '1.5rem' }
              }}
            >
              Key Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {project.features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    borderLeft: '3px solid black',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 400
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Project Links */}
          {project.links && project.links.length > 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2.5, md: 3.5 }, 
                border: '1px solid black',
                mb: { xs: 3, md: 4 },
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  fontSize: { xs: '1.4rem', md: '1.5rem' }
                }}
              >
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
          )}

          {/* Collaborators Section (Optional) */}
          {project.collaborators && project.collaborators.length > 0 && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2.5, md: 3.5 }, 
                border: '1px solid black',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  mb: 3,
                  fontWeight: 600,
                  fontSize: { xs: '1.4rem', md: '1.5rem' }
                }}
              >
                Collaborators
              </Typography>
              <Grid container spacing={1.5}>
                {project.collaborators.map((collaborator, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'black',
                          mr: 1.5,
                          flexShrink: 0
                        }}
                      />
                      <Typography 
                        variant="body2"
                        sx={{
                          fontSize: '0.95rem',
                          fontWeight: 400
                        }}
                      >
                        {collaborator}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Lightbox Modal */}
      <Dialog
        open={openLightbox}
        onClose={handleCloseLightbox}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative', bgcolor: 'black', p: 1 }}>
          {/* Close button */}
          <IconButton
            onClick={handleCloseLightbox}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'white',
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {/* Navigation Arrows */}
          {project.screenshots && project.screenshots.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 1,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ArrowBackIcon fontSize="large" />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 1,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
              >
                <ArrowForwardIcon fontSize="large" />
              </IconButton>
            </>
          )}
          
          {/* Main Image */}
          {selectedImage !== null && project.screenshots && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: '50vh', md: '80vh' },
              width: '100%'
            }}>
              <Box
                component="img"
                src={project.screenshots[selectedImage].url}
                alt={project.screenshots[selectedImage].caption}
                sx={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
          
          {/* Caption */}
          {selectedImage !== null && project.screenshots && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'white',
                textAlign: 'center',
                pt: 2,
                pb: 1
              }}
            >
              {project.screenshots[selectedImage].caption}
            </Typography>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default CodingProjectInfo; 