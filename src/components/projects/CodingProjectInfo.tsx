import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';

// Define the coding projects data
const codingProjects = {
  'data-visualization': {
    title: 'Data Visualization Dashboard',
    description: 'Interactive React dashboard using D3.js for visualizing complex datasets with customizable views.',
    fullDescription: `This project is an interactive data visualization dashboard built with React and D3.js. It provides a flexible framework for displaying and interacting with complex datasets through various visualization types such as charts, graphs, and maps.

The dashboard features a modular architecture that allows for easy extension with new visualization components. Users can customize views, filter data, and export visualizations in multiple formats. The application incorporates responsive design principles to ensure optimal viewing across different devices.`,
    technologies: ['React', 'TypeScript', 'D3.js', 'Material-UI', 'Node.js'],
    features: [
      'Interactive visualization components with zoom, pan, and filter capabilities',
      'Real-time data updates with WebSocket integration',
      'Customizable dashboard layouts with drag-and-drop functionality',
      'Data export in multiple formats (CSV, JSON, PNG)',
      'Responsive design for desktop and mobile devices'
    ],
    links: [
      { title: 'GitHub Repository', url: '#', icon: <GitHubIcon /> },
      { title: 'Live Demo', url: '#', icon: <LaunchIcon /> }
    ],
    screenshots: [
      { image: 'placeholder-image-url', caption: 'Main Dashboard View' },
      { image: 'placeholder-image-url', caption: 'Chart Configuration Panel' }
    ]
  },
  'api-framework': {
    title: 'API Integration Framework',
    description: 'A TypeScript library for simplifying API integrations with built-in caching, error handling, and request management.',
    fullDescription: `The API Integration Framework is a TypeScript library designed to simplify the process of integrating with external APIs. It provides a consistent interface for making API requests while handling common concerns such as authentication, caching, error handling, and request/response transformation.

The framework employs a plugin architecture that allows developers to extend its functionality for specific API providers. It includes built-in support for request batching, retry logic, and rate limiting to optimize API usage and improve application performance.`,
    technologies: ['TypeScript', 'Axios', 'Jest', 'Webpack', 'Node.js'],
    features: [
      'Unified interface for multiple API providers',
      'Smart caching with configurable strategies',
      'Automatic request retry with exponential backoff',
      'Comprehensive error handling and logging',
      'Request batching and deduplication',
      'Mock API responses for testing and development'
    ],
    links: [
      { title: 'GitHub Repository', url: '#', icon: <GitHubIcon /> },
      { title: 'Documentation', url: '#', icon: <LaunchIcon /> },
      { title: 'NPM Package', url: '#', icon: <LaunchIcon /> }
    ],
    screenshots: [
      { image: 'placeholder-image-url', caption: 'Code Example' }
    ]
  },
  'ml-pipeline': {
    title: 'Machine Learning Pipeline',
    description: 'End-to-end ML pipeline using TensorFlow and Docker for training, evaluating, and deploying models.',
    fullDescription: `This project implements an end-to-end machine learning pipeline that automates the process of data preparation, model training, evaluation, and deployment. Built with TensorFlow and containerized with Docker, the pipeline provides a reproducible environment for machine learning workflows.

The system includes components for data validation, feature engineering, model training with hyperparameter tuning, performance evaluation, and model serving. It incorporates best practices for ML operations (MLOps) such as experiment tracking, model versioning, and continuous deployment.`,
    technologies: ['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'Flask', 'MongoDB'],
    features: [
      'Automated data validation and preprocessing',
      'Distributed model training with parameter tuning',
      'Model performance monitoring and alerting',
      'A/B testing framework for model evaluation',
      'REST API for model inference',
      'CI/CD integration for continuous model deployment'
    ],
    links: [
      { title: 'GitHub Repository', url: '#', icon: <GitHubIcon /> },
      { title: 'Technical Blog Post', url: '#', icon: <LaunchIcon /> }
    ],
    screenshots: [
      { image: 'placeholder-image-url', caption: 'Pipeline Architecture' },
      { image: 'placeholder-image-url', caption: 'Model Evaluation Dashboard' }
    ]
  }
};

const CodingProjectInfo: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? codingProjects[projectId as keyof typeof codingProjects] : null;

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" className="manga-title" gutterBottom>
          Project Not Found
        </Typography>
        <Button 
          variant="outlined" 
          component={Link} 
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Portfolio
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button 
        variant="outlined" 
        component={Link} 
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Portfolio
      </Button>

      <Typography variant="h3" component="h1" className="manga-title" gutterBottom>
        {project.title}
      </Typography>

      <Box sx={{ mb: 3 }}>
        {project.technologies.map((tech, index) => (
          <Chip 
            key={index} 
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
        <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
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

      {project.screenshots && project.screenshots.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid black', mb: 4 }}>
          <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
            Screenshots
          </Typography>
          <Grid container spacing={2}>
            {project.screenshots.map((screenshot, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ 
                  width: '100%', 
                  height: 200, 
                  bgcolor: 'rgba(0,0,0,0.05)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  border: '1px dashed #ccc'
                }}>
                  <Typography variant="body2" color="textSecondary">
                    {screenshot.caption} (Screenshot placeholder)
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, border: '1px solid black' }}>
        <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
          Project Links
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {project.links.map((link, index) => (
            <Button 
              key={index}
              variant="outlined"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={link.icon}
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