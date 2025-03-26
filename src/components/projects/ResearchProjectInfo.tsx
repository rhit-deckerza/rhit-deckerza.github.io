import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Box, Button, Chip, List, ListItem, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import { ResearchProject } from '../../utils/projectData';
import { fetchProjects } from '../../utils/projectData';

const ResearchProjectInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ResearchProject | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjects();
      if (id && data.research[id]) {
        setProject(data.research[id]);
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
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

          {/* Images Section */}
          {project.images.length > 0 && (
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
              <Grid container spacing={3}>
                {project.images.map((image, index) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={project.images.length === 1 ? 12 : 6} 
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
                        maxWidth: project.images.length === 1 ? '80%' : '100%',
                        mx: 'auto',
                        '&:last-child': { mb: 0 }
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt={image.caption}
                        sx={{ 
                          width: '100%', 
                          height: 'auto',
                          maxHeight: project.images.length === 1 ? '400px' : '280px',
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
                        {image.caption}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
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

          {/* Collaborators */}
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResearchProjectInfo; 