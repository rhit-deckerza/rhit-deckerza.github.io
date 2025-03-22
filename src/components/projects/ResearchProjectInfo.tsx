import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, Chip, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define the research projects data
const researchProjects = {
  'material-science': {
    title: 'Machine Learning for Material Science',
    description: 'Investigating novel approaches to predict material properties using neural networks and transfer learning techniques.',
    fullDescription: `This research project explores the application of machine learning algorithms to predict and discover new materials with desired properties. By leveraging large datasets of known materials and their properties, we've developed neural network models that can accurately predict various properties of new, theoretical materials.

Our approach combines transfer learning techniques with domain-specific knowledge to create models that are both accurate and interpretable. The results have potential applications in fields such as energy storage, semiconductors, and structural materials.`,
    tags: ['Machine Learning', 'Material Science', 'Neural Networks', 'Transfer Learning'],
    links: [
      { title: 'Research Paper', url: '#' },
      { title: 'Dataset', url: '#' },
      { title: 'Code Repository', url: '#' }
    ],
    keyFindings: [
      'Developed a neural network architecture that predicts material properties with 94% accuracy',
      'Identified novel composite materials with improved thermal conductivity',
      'Created a transfer learning approach that reduces training time by 65%',
      'Implemented an interpretable model that provides insights into structure-property relationships'
    ],
    collaborators: ['Dr. Jane Smith', 'Prof. Robert Johnson', 'Advanced Materials Research Lab']
  },
  'nlp-documentation': {
    title: 'NLP for Technical Documentation',
    description: 'Developing specialized language models for extracting insights from engineering and scientific literature.',
    fullDescription: `This project focuses on developing specialized natural language processing models to extract, analyze, and summarize technical information from engineering and scientific literature. Traditional NLP models often struggle with domain-specific terminology and concepts found in technical documentation.

Our research has led to the development of custom language models trained specifically on engineering and scientific corpora. These models are designed to understand technical jargon, identify key concepts, and extract relevant information from complex documents.`,
    tags: ['Natural Language Processing', 'Information Extraction', 'Technical Documentation', 'Deep Learning'],
    links: [
      { title: 'Research Publication', url: '#' },
      { title: 'Demo System', url: '#' },
      { title: 'Technical Report', url: '#' }
    ],
    keyFindings: [
      'Created domain-specific word embeddings that improve technical term recognition by 37%',
      'Developed an automated system that extracts procedural information from technical manuals with 82% accuracy',
      'Implemented a summarization algorithm that preserves technical accuracy while reducing document length by 70%',
      'Designed an annotation system for technical knowledge graphs'
    ],
    collaborators: ['Technical Documentation Research Group', 'Dr. Michael Chen', 'Sarah Williams, PhD']
  }
};

const ResearchProjectInfo: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? researchProjects[projectId as keyof typeof researchProjects] : null;

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
      
  
      <Typography variant="h3" component="h1" className="manga-title" gutterBottom>
        {project.title}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        {project.tags.map((tag, index) => (
          <Chip 
            key={index} 
            label={tag} 
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid black', height: '100%' }}>
            <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
              Key Findings
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {project.keyFindings.map((finding, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  {finding}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid black', height: '100%' }}>
            <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
              Collaborators
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {project.collaborators.map((collaborator, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  {collaborator}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid black', mt: 4 }}>
        <Typography variant="h5" component="h2" className="manga-title" gutterBottom>
          Resources & Links
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {project.links.map((link, index) => (
            <Button 
              key={index}
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

export default ResearchProjectInfo; 