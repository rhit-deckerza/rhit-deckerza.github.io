import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Link,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import CreateIcon from '@mui/icons-material/Create';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './ResumeBuilder.css';

// Define resume data structure
interface Education {
  institution: string;
  location: string;
  graduationDate: string;
  degree: string;
  gpa?: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  dateRange: string;
  bullets: string[];
}

interface Project {
  name: string;
  dateRange: string;
  bullets: string[];
}

interface Publication {
  title: string;
  citation: string;
  bullets: string[];
}

interface ResumeData {
  name: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  education?: Education[];
  technicalSkills?: string[];
  experience?: Experience[];
  projects?: Project[];
  publications?: Publication[];
}

// Sample AI suggestion that includes JSON
interface AISuggestion {
  text: string;
  sender: 'user' | 'ai';
  suggestion?: {
    type: 'json';
    data: string;
  };
}

function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("JSON copied to clipboard!");
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<AISuggestion[]>([
    { 
      text: "Hi there! I'm your resume assistant. I can help you customize your resume or answer any questions about it. What would you like help with?", 
      sender: 'ai' 
    }
  ]);
  const resumeRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Predefined prompts for quick suggestions
  const quickPrompts = [
    { label: "Improve Experience", icon: <WorkIcon />, prompt: "Can you help improve my work experience section?" },
    { label: "Enhance Education", icon: <SchoolIcon />, prompt: "How can I enhance my education section?" },
    { label: "Optimize Skills", icon: <CodeIcon />, prompt: "Suggest improvements for my technical skills." },
    { label: "Polish Projects", icon: <CreateIcon />, prompt: "How can I make my projects section more impressive?" },
    { label: "Refine Publications", icon: <MenuBookIcon />, prompt: "Can you help refine my publications section?" }
  ];

  // Fetch sample JSON on component mount
  useEffect(() => {
    fetch('/sampleResumeData.json')
      .then(response => response.json())
      .then(data => {
        const formattedJson = JSON.stringify(data, null, 2);
        setJsonInput(formattedJson);
        setResumeData(data);
      })
      .catch(error => {
        console.error('Error loading sample JSON:', error);
        setErrorMessage('Could not load sample resume data.');
      });
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const timeoutId = setTimeout(() => {
        handleParseJson();
      }, 1000); // Delay to avoid parsing on every keystroke
      
      return () => clearTimeout(timeoutId);
    }
  }, [jsonInput, autoRefresh]);

  // Parse JSON from textarea
  const handleParseJson = () => {
    try {
      const data = JSON.parse(jsonInput);
      setResumeData(data);
      setErrorMessage("");
    } catch (error) {
      // Don't update error message during auto-refresh to avoid flickering
      if (!autoRefresh) {
        console.error("Error parsing JSON:", error);
        setErrorMessage("Invalid JSON format. Please check your input.");
      }
    }
  };

  // Download resume as PDF
  const handleDownloadPdf = () => {
    if (!resumeRef.current) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website to enable PDF printing.');
      return;
    }

    // Create a helper function to get HTML content with proper bold formatting
    const processResumeHTML = () => {
      // Make sure resumeRef.current is not null
      if (!resumeRef.current) return '';
      
      // Clone the resume div
      const resumeContent = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Find all text nodes in bullet points and process them for bold formatting
      const listItems = resumeContent.querySelectorAll('li');
      listItems.forEach(li => {
        // Get the original bullet text from the React component
        const bulletText = li.textContent || '';
        
        // Only process if the bullet has ** markers
        if (bulletText.includes('**')) {
          // Clear the current content
          li.innerHTML = '';
          
          // Split by ** markers and rebuild HTML
          const parts = bulletText.split(/(\*\*.*?\*\*)/g);
          parts.forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              const strong = document.createElement('strong');
              strong.textContent = boldText;
              li.appendChild(strong);
            } else {
              li.appendChild(document.createTextNode(part));
            }
          });
        }
      });
      
      return resumeContent.outerHTML;
    };

    // Add print-specific styles
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData?.name || 'Resume'}</title>
          <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: "EB Garamond", "Garamond", serif;
              font-size: 10pt;
              margin: 0;
              padding: 0;
              color: #000000;
            }
            .resume {
              width: 8.5in;
              height: 11in;
              padding: 0.5in;
              box-sizing: border-box;
              margin: 0 auto;
              line-height: 1;
              color: #000000;
            }
            .header {
              text-align: center;
              padding-bottom: 8px;
              margin-bottom: 16px;
            }
            .header h1 {
              margin: 0;
              font-size: 16pt;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .header p {
              margin: 3px 0;
              font-size: 10pt;
              line-height: 1;
            }
            .section {
              margin-bottom: 16px;
            }
            .section h2 {
              text-transform: uppercase;
              border-bottom: 2px solid #666;
              padding-bottom: 3px;
              margin-bottom: 6px;
              font-size: 12pt;
              letter-spacing: 0.5px;
              font-weight: 600;
            }
            .job-title, .project-title, .publication-title {
              font-weight: 600;
            }
            .project-subtitle {
              margin-top: 0;
              margin-bottom: 3px;
              margin-left: 4px;
              font-style: normal;
            }
            .date-range {
              font-style: normal;
              font-size: 0.9rem;
              color: #000000;
              float: right;
            }
            .publication-date {
              font-style: italic;
              font-size: 0.9rem;
              color: #000000;
            }
            ul {
              margin: 0;
              padding-left: 24px;
              list-style-type: circle;
            }
            li {
              margin-bottom: 3px;
              line-height: 1;
              padding-left: 8px;
              text-indent: -8px;
            }
            li strong {
              font-weight: 600;
            }
            p {
              margin-top: 0;
              margin-bottom: 3px;
              line-height: 1;
            }
            /* Technical skills styling */
            .skills-container {
              display: grid;
              grid-template-columns: max-content 1fr;
              grid-gap: 6px 14px;
              width: 100%;
            }
            .skill-category-title {
              font-weight: 600;
              padding-right: 5px;
            }
            .skill-items {
              padding-left: 0;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${processResumeHTML()}
        </body>
      </html>
    `);

    // Print and close the window when done
    printWindow.document.close();
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      // Uncomment to auto-close after print dialog
      // printWindow.close();
    };
  };

  // Copy JSON to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  // Close snackbar
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Render education section
  const renderEducation = () => {
    if (!resumeData?.education || resumeData.education.length === 0) return null;

    return (
      <div className="section">
        <h2>EDUCATION</h2>
        <div id="educationList">
          {resumeData.education.map((edu, index) => (
            <div key={index}>
              <p>
                <strong>{edu.institution}</strong>, {edu.location}
                <span className="date-range">{edu.graduationDate}</span><br />
                {edu.degree}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render technical skills section
  const renderTechnicalSkills = () => {
    if (!resumeData?.technicalSkills || resumeData.technicalSkills.length === 0) return null;

    // Group skills by category
    const skillsByCategory: Record<string, string[]> = {};
    
    resumeData.technicalSkills.forEach(skill => {
      // Format expected: "Category: Skill1, Skill2, Skill3"
      const parts = skill.split(':');
      if (parts.length === 2) {
        const category = parts[0].trim();
        const items = parts[1].split(',').map(item => item.trim());
        
        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
        }
        
        skillsByCategory[category].push(...items);
      } else {
        // For backward compatibility, put uncategorized skills in "Other"
        if (!skillsByCategory['Other']) {
          skillsByCategory['Other'] = [];
        }
        skillsByCategory['Other'].push(skill);
      }
    });

    return (
      <div className="section">
        <h2>TECHNICAL SKILLS</h2>
        <div id="technicalSkillsList" className="skills-container">
          {Object.entries(skillsByCategory).map(([category, skills], index) => (
            <React.Fragment key={index}>
              <div className="skill-category-title">{category}:</div>
              <div className="skill-items">{skills.join(', ')}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render experience section
  const renderExperience = () => {
    if (!resumeData?.experience || resumeData.experience.length === 0) return null;

    return (
      <div className="section">
        <h2>EXPERIENCE</h2>
        <div id="experienceList">
          {resumeData.experience.map((job, index) => (
            <div key={index}>
              <p>
                <span className="job-title">{job.title}</span>, {job.company}, {job.location}
                <span className="date-range">{job.dateRange}</span>
              </p>
              {job.bullets && job.bullets.length > 0 && (
                <ul>
                  {job.bullets.map((bullet, idx) => (
                    <li key={idx}>{parseBulletText(bullet)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render projects section
  const renderProjects = () => {
    if (!resumeData?.projects || resumeData.projects.length === 0) return null;

    return (
      <div className="section">
        <h2>PROJECTS</h2>
        <div id="projectsList">
          {resumeData.projects.map((project, index) => (
            <div key={index}>
              <p>
                <span className="project-title">{project.name}</span>
                <span className="date-range">{project.dateRange}</span>
              </p>
              {project.bullets && project.bullets.length > 0 && (
                <>
                  {/* First bullet becomes a subtitle */}
                  <p className="project-subtitle">{parseBulletText(project.bullets[0])}</p>
                  
                  {/* Remaining bullets as a list */}
                  {project.bullets.length > 1 && (
                    <ul>
                      {project.bullets.slice(1).map((bullet, idx) => (
                        <li key={idx}>{parseBulletText(bullet)}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render publications section
  const renderPublications = () => {
    if (!resumeData?.publications || resumeData.publications.length === 0) return null;

    return (
      <div className="section">
        <h2>PUBLICATIONS</h2>
        <div id="publicationsList">
          {resumeData.publications.map((pub, index) => (
            <div key={index}>
              <p>
                <span className="publication-title">{pub.title}</span>, {pub.citation}
              </p>
              {pub.bullets && pub.bullets.length > 0 && (
                <ul>
                  {pub.bullets.map((bullet, idx) => (
                    <li key={idx}>{parseBulletText(bullet)}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle chat input submission
  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { text: chatInput, sender: 'user' }]);
    
    // Clear input
    setChatInput('');
    
    // Simulate AI response (in a real implementation this would call the OpenAI API)
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          text: "This is a placeholder response. In the final implementation, this would be a response from the OpenAI API based on your resume.", 
          sender: 'ai' 
        }
      ]);
    }, 1000);
  };

  // Simulated AI response with JSON suggestion
  const mockAIResponseWithSuggestion = (prompt: string): AISuggestion => {
    // Only for "Improve Experience" we'll provide a sample JSON suggestion
    if (prompt.includes("experience")) {
      // Create a modified version of the current resume JSON
      try {
        const currentData = JSON.parse(jsonInput);
        
        // Add a more impressive bullet point to the first experience
        if (currentData.experience && currentData.experience.length > 0) {
          const improvedJSON = { ...currentData };
          
          if (!improvedJSON.experience[0].bullets) {
            improvedJSON.experience[0].bullets = [];
          }
          
          improvedJSON.experience[0].bullets.push(
            "Led **cross-functional team of 5 engineers** to deliver project **2 weeks ahead of schedule**, resulting in **15% cost savings**."
          );
          
          return { 
            text: "I've analyzed your experience section and have a suggestion to make it more impactful. Consider adding a quantifiable achievement that demonstrates leadership and results. I've prepared a JSON update that you can apply directly.", 
            sender: 'ai' as const,
            suggestion: {
              type: 'json' as const,
              data: JSON.stringify(improvedJSON, null, 2)
            }
          };
        }
      } catch (error) {
        console.error("Error generating suggestion:", error);
      }
    }
    
    // Default response for other prompts
    return { 
      text: `This is a placeholder response to your question: "${prompt}". In the final implementation, this would be a tailored response from the OpenAI API.`, 
      sender: 'ai' as const
    };
  };

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    // If you want to automatically send the message:
    setChatMessages(prev => [...prev, { text: prompt, sender: 'user' }]);
    
    // Clear input
    setChatInput('');
    
    // Simulate AI response with potential JSON suggestion
    setTimeout(() => {
      const response = mockAIResponseWithSuggestion(prompt);
      setChatMessages(prev => [...prev, response]);
    }, 1000);
  };

  // Apply AI suggestion JSON
  const handleApplySuggestion = (suggestionJSON: string) => {
    setJsonInput(suggestionJSON);
    try {
      const data = JSON.parse(suggestionJSON);
      setResumeData(data);
      setSnackbarMessage("AI suggestion applied successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error applying suggestion:", error);
      setErrorMessage("Could not apply the suggestion. Invalid JSON format.");
    }
  };

  // Parse bullet text with bold formatting (text inside ** will be bolded)
  const parseBulletText = (text: string) => {
    if (!text.includes('**')) return text;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2); // Remove the ** markers
        return <strong key={index}>{boldText}</strong>;
      }
      return part;
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Resume Builder with AI Assistant
        </Typography>
        
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>How to Use This Tool</Typography>
          <Typography variant="body1" paragraph>
            Create and download professional résumés from JSON data with AI assistance:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>Edit the JSON in the text editor to customize your resume data</Box>
            <Box component="li" sx={{ mb: 1 }}>Preview your resume in real-time</Box>
            <Box component="li" sx={{ mb: 1 }}>Chat with the AI assistant for help and suggestions</Box>
            <Box component="li" sx={{ mb: 1 }}>Download your resume as a PDF when ready</Box>
          </Box>
        </Paper>
      </Box>

      <div className="new-layout">
        {/* Resume Preview - Top Row */}
        <div className="resume-container">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              mb: 4,
              backgroundColor: '#f8f9fa',
              width: '100%',
              overflowX: 'auto'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderBottom: '1px solid #eee', 
              pb: 1,
              mb: 2
            }}>
              <Typography variant="h6">
                Resume Preview
              </Typography>
              {resumeData && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDownloadPdf}
                  startIcon={<DownloadIcon />}
                  size="small"
                >
                  Download PDF
                </Button>
              )}
            </Box>
            
            {resumeData ? (
              <div 
                ref={resumeRef} 
                className="resume" 
                style={{ 
                  fontFamily: '"EB Garamond", "Garamond", serif',
                  fontSize: '10pt',
                  padding: '0.5in',
                  width: '8.5in',
                  height: '11in',
                  boxSizing: 'border-box',
                  margin: '0 auto',
                  lineHeight: '1'
                }}
              >
                {/* Header */}
                <div style={{ textAlign: 'center', paddingBottom: '8px', marginBottom: '16px' }}>
                  <h1 style={{ margin: 0, fontSize: '16pt', fontWeight: 600, letterSpacing: '0.5px' }}>{resumeData.name}</h1>
                  <p style={{ margin: '3px 0', fontSize: '10pt', lineHeight: '1' }}>
                    {resumeData.location} | {resumeData.phone} | {resumeData.email}
                  </p>
                  {resumeData.website && (
                    <p style={{ margin: '2px 0', fontSize: '10pt', lineHeight: '1' }}>{resumeData.website}</p>
                  )}
                </div>

                {/* Content Sections */}
                {renderEducation()}
                {renderTechnicalSkills()}
                {renderExperience()}
                {renderProjects()}
                {renderPublications()}
              </div>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  Loading resume preview...
                </Typography>
              </Box>
            )}
          </Paper>
        </div>

        {/* Bottom Row with Editor and Chat side by side */}
        <div className="bottom-row">
          {/* JSON Editor */}
          <div className="editor-container">
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Resume JSON
                </Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopyToClipboard}
                    sx={{ mr: 1 }}
                  >
                    Copy
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Auto-refresh"
                  />
                </Box>
              </Box>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                aria-label="Resume JSON data editor"
                placeholder="Enter your resume data in JSON format"
                className="json-editor"
                style={{
                  flex: '1',
                  minHeight: '400px'
                }}
              />
              {!autoRefresh && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleParseJson}
                  startIcon={<RefreshIcon />}
                  sx={{ mt: 2 }}
                >
                  Update Resume
                </Button>
              )}

              {errorMessage && (
                <Paper elevation={2} sx={{ p: 2, mt: 2, bgcolor: '#fff4f4' }}>
                  <Typography color="error">{errorMessage}</Typography>
                </Paper>
              )}
            </Paper>
          </div>

          {/* Chat Interface */}
          <div className="chat-container">
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                AI Resume Assistant
              </Typography>
              
              {/* Quick Suggestion Chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: '100%', mb: 1 }}>
                  Quick suggestions:
                </Typography>
                {quickPrompts.map((item, index) => (
                  <Chip
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleQuickPrompt(item.prompt)}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
              
              {/* Chat Messages */}
              <Box 
                sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  mb: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="chat-messages"
              >
                <List sx={{ width: '100%', p: 0 }}>
                  {chatMessages.map((msg, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ 
                          flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                          mb: 1 
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: msg.sender === 'user' ? '#e3f2fd' : '#fff',
                            borderRadius: 2,
                            p: 1.5,
                            maxWidth: '80%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.text}
                          </Typography>
                          
                          {/* If this message has a suggestion */}
                          {msg.suggestion && msg.suggestion.type === 'json' && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <Tooltip title="Apply this suggestion to your resume">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleApplySuggestion(msg.suggestion!.data)}
                                >
                                  Apply Suggestion
                                </Button>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>
                      </ListItem>
                      {index < chatMessages.length - 1 && (
                        <Divider variant="middle" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              </Box>
              
              {/* Chat Input */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Ask about your resume..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  sx={{ mr: 1 }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={chatInput.trim() === ''}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Paper>
          </div>
        </div>
      </div>

      {/* Success notification for copy to clipboard */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ResumeBuilder; 