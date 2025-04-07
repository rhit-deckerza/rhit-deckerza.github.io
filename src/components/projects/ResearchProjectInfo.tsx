import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Box, Button, Chip, List, ListItem, ListItemText, Divider, useTheme, useMediaQuery, IconButton, Dialog } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderIcon from '@mui/icons-material/Folder';
import { ResearchProject, Visualization } from '../../utils/projectData';
import { fetchProjects } from '../../utils/projectData';

const ResearchProjectInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [currentVisualizationIndex, setCurrentVisualizationIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const visualizationRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjects();
      if (id && data.research[id]) {
        setProject(data.research[id]);
        if (data.research[id].images && data.research[id].images.length > 0) {
          setSelectedImage(0);
        }
      }
    };
    loadProject();
  }, [id]);

  // Function to create HTML visualization
  const renderHtmlVisualization = (html: string, height?: string, width?: string) => {
    return (
      <Box
        sx={{
          width: width || '100%',
          height: height || '450px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 3,
          '& iframe': {
            border: 'none',
            width: '100%',
            height: '100%'
          }
        }}
      >
        <iframe
          srcDoc={html}
          title="Embedded HTML Visualization"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </Box>
    );
  };

  useEffect(() => {
    // Listen for navigation messages from iframes
    const handleMessageEvent = (event: MessageEvent) => {
      // Only process messages with the correct format
      if (event.data && event.data.type === 'navigate') {
        const direction = event.data.direction;
        
        if (project?.visualizations) {
          if (direction === 'next' && currentVisualizationIndex < project.visualizations.length - 1) {
            setCurrentVisualizationIndex(currentVisualizationIndex + 1);
          } else if (direction === 'prev' && currentVisualizationIndex > 0) {
            setCurrentVisualizationIndex(currentVisualizationIndex - 1);
          }
        }
      }
    };

    window.addEventListener('message', handleMessageEvent);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('message', handleMessageEvent);
    };
  }, [currentVisualizationIndex, project]);

  const handlePrevImage = () => {
    if (!project || !project.images) return;
    setSelectedImage(prev => 
      prev === null ? null : (prev === 0 ? project.images.length - 1 : prev - 1)
    );
  };

  const handleNextImage = () => {
    if (!project || !project.images) return;
    setSelectedImage(prev => 
      prev === null ? null : (prev === project.images.length - 1 ? 0 : prev + 1)
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

  // Check if project has either old images or new visualizations
  const hasVisualizations = project.visualizations && project.visualizations.length > 0;
  const hasImages = project.images && project.images.length > 0;

  // Get the current visualization
  const currentVisualization = hasVisualizations && 
    project.visualizations && currentVisualizationIndex < project.visualizations.length ? 
    project.visualizations[currentVisualizationIndex] : null;

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
              fontSize: { xs: '1rem', md: '1.1rem' }
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
          {project.tags.map((tag) => (
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
          {project.technicalTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
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

          {/* Visualizations Section */}
          {hasVisualizations && (
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
                Research Visualizations
              </Typography>

              {/* Current Visualization */}
              {currentVisualization && (
                <Box sx={{ mb: 2 }}>
                  {currentVisualization.type === 'image' && currentVisualization.url && (
                    <>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {currentVisualization.caption}
                      </Typography>
                      <Box
                        component="img"
                        src={currentVisualization.url}
                        alt={currentVisualization.caption}
                        sx={{ 
                          width: '100%', 
                          height: 'auto',
                          maxHeight: '400px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                    </>
                  )}
                  
                  {currentVisualization.type === 'html' && currentVisualization.htmlContent && (
                    <Box
                      ref={el => {
                        if (visualizationRefs.current.length <= currentVisualizationIndex) {
                          visualizationRefs.current.push(null);
                        }
                        visualizationRefs.current[currentVisualizationIndex] = el as HTMLIFrameElement;
                      }}
                    >
                      {renderHtmlVisualization(
                        currentVisualization.htmlContent, 
                        currentVisualization.height,
                        currentVisualization.width
                      )}
                    </Box>
                  )}
                </Box>
              )}
              
              {/* Visualization Navigation Controls */}
              {hasVisualizations && project.visualizations && project.visualizations.length > 1 && (
                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button 
                    variant="outlined"
                    disabled={currentVisualizationIndex === 0}
                    onClick={() => setCurrentVisualizationIndex(prev => Math.max(0, prev - 1))}
                    sx={{ 
                      minWidth: '100px',
                      borderColor: 'black',
                      color: 'black',
                      '&:hover': {
                        borderColor: 'black',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      },
                      '&.Mui-disabled': {
                        borderColor: '#ccc',
                        color: '#ccc'
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {currentVisualizationIndex + 1} of {project.visualizations?.length || 0}
                  </Typography>
                  <Button 
                    variant="outlined"
                    disabled={!hasVisualizations || currentVisualizationIndex === project.visualizations!.length - 1}
                    onClick={() => {
                      if (hasVisualizations) {
                        setCurrentVisualizationIndex(prev => 
                          Math.min(project.visualizations!.length - 1, prev + 1)
                        );
                      }
                    }}
                    sx={{ 
                      minWidth: '100px',
                      borderColor: 'black',
                      color: 'black',
                      '&:hover': {
                        borderColor: 'black',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      },
                      '&.Mui-disabled': {
                        borderColor: '#ccc',
                        color: '#ccc'
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Paper>
          )}

          {/* Images Section */}
          {hasImages && (
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
                Research Images
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
                    {project.images.length > 1 && (
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
                        src={project.images[selectedImage].url}
                        alt={project.images[selectedImage].caption}
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
                    {project.images.length > 1 && (
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
                    {project.images[selectedImage].caption}
                  </Typography>
                </Box>
              )}
              
              {/* Thumbnail Grid */}
              {project.images.length > 1 && (
                <Grid container spacing={2}>
                  {project.images.map((image, index) => (
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
                          src={image.url}
                          alt={image.caption}
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
          {/* Key Takeaways */}
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
              Key Takeaways
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {project.keyTakeaways.map((takeaway, index) => (
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
                    {takeaway}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Resources & Links */}
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
              Resources & Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {project.links.map((link) => {
                const isPdf = link.url.toLowerCase().endsWith('.pdf');
                const isLocal = !link.url.startsWith('http') && !link.url.startsWith('//');
                const fullUrl = isLocal ? `${link.url}` : link.url;
                
                let icon;
                if (isPdf) {
                  icon = <PictureAsPdfIcon />;
                } else if (isLocal) {
                  icon = <FolderIcon />;
                } else {
                  icon = <OpenInNewIcon />;
                }
                
                return (
                  <Button
                    key={link.title}
                    variant="outlined"
                    size="medium"
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={isPdf}
                    component={isPdf ? "a" : Button}
                    fullWidth
                    startIcon={icon}
                    onClick={(e) => {
                      if (isPdf && isLocal) {
                        e.preventDefault();
                        const a = document.createElement('a');
                        a.href = fullUrl;
                        a.download = fullUrl.split('/').pop() || 'download.pdf';
                        a.type = 'application/pdf';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1.25,
                      px: 2.5,
                      borderColor: isPdf ? 'error.main' : isLocal ? 'info.main' : 'inherit',
                      color: isPdf ? 'error.main' : isLocal ? 'info.main' : 'inherit',
                      '&:hover': {
                        borderColor: isPdf ? 'error.dark' : isLocal ? 'info.dark' : 'black',
                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    {link.title} {isLocal && <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>(Download)</Typography>}
                  </Button>
                );
              })}
            </Box>
          </Paper>

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
          {project.images && project.images.length > 1 && (
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
          {selectedImage !== null && project.images && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: { xs: '50vh', md: '80vh' },
              width: '100%'
            }}>
              <Box
                component="img"
                src={project.images[selectedImage].url}
                alt={project.images[selectedImage].caption}
                sx={{ 
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}
          
          {/* Caption */}
          {selectedImage !== null && project.images && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'white',
                textAlign: 'center',
                pt: 2,
                pb: 1
              }}
            >
              {project.images[selectedImage].caption}
            </Typography>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default ResearchProjectInfo; 