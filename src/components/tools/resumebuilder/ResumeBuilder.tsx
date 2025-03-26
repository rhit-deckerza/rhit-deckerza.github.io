// At the top of the file, add this type declaration
declare global {
  interface ImportMeta {
    env: {
      VITE_OPENAI_API_ENDPOINT: string;
      VITE_OPENAI_API_KEY: string;
    }
  }
}

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
  Tooltip,
  ListItemIcon,
  ListItemSecondaryAction,
  Grid,
  Modal,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Avatar,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StarIcon from '@mui/icons-material/Star';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import '../../ui/ResumeBuilder.css';
import '../../ui/MangaTheme.css';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { resumeApi } from '../../../services/api';
import { styled } from '@mui/material/styles';

// Generate a local user ID for this session
const SESSION_ID = `local-${Date.now()}`;

// Define file context interface
interface ContextFile {
  id: string;
  name: string;
  content: string;
  preview: string;
  size: number;
  included: boolean;
}

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
  versions: ResumeVersion[];
}

// Define the OpenAI API request/response interfaces
interface OpenAIRequest {
  resumeJSON: any;
  instructions: string;
  context?: string;
}

interface OpenAIResponse {
  explanation: string;
  updatedResumeJSON: string;
}

// First, let's update the AISuggestion interface for better typing
interface AISuggestion {
  text: string;
  sender: 'user' | 'ai';
  suggestion?: string | null;
  timestamp?: number; // Add timestamp for sorting/tracking
}

// Create a separate worker file for PDF generation
// pdfWorker.js
self.onmessage = function(e) {
  const { html, resumeData } = e.data;
  // Process PDF generation here
  // Use postMessage to send back result
};

// Define resume template interface
interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Define resume version interface
interface ResumeVersion {
  id: string;
  name: string;
  dateModified: string;
  isActive: boolean;
  content?: any;
}

// Update the chat history key to be independent of resume versions
const CHAT_HISTORY_KEY = 'global_chat_history';

function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true); // Always true, toggle removed
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("JSON copied to clipboard!");
  const [chatInput, setChatInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editorTheme, setEditorTheme] = useState<string>("vs-light");
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [contextFiles, setContextFiles] = useState<ContextFile[]>([]);
  const [showContextSection, setShowContextSection] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMessages, setChatMessages] = useState<AISuggestion[]>([
    { 
      text: "Hi there! I'm your resume assistant. I can help you improve and customize your resume. Here are some ways to get started:\n\n• Paste in your existing resume and I'll help format it\n• Share a job description and I'll tailor your resume for it\n• Ask specific questions about improving sections of your resume\n\nWhat would you like help with today?", 
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const resumeRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [openFullScreen, setOpenFullScreen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [resumeVersions, setResumeVersions] = useState<ResumeVersion[]>([]);
  const [resumeVersionsLoading, setResumeVersionsLoading] = useState<boolean>(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // API endpoint and key
  const OPENAI_API_ENDPOINT = import.meta.env.VITE_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  // Maximum file size in bytes (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Sample resume templates
  const resumeTemplates: ResumeTemplate[] = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple layout with essential sections',
      icon: <EventNoteIcon />,
      color: '#3f51b5'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Highlights technical skills and projects',
      icon: <CodeIcon />,
      color: '#4caf50'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Ideal for academic and research positions',
      icon: <SchoolIcon />,
      color: '#ff9800'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Emphasizes work experience and achievements',
      icon: <WorkIcon />,
      color: '#f44336'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'For senior leadership and management roles',
      icon: <StarIcon />,
      color: '#9c27b0'
    }
  ];

  // Modified to load chat history independently from resume versions
  const loadChatHistory = () => {
    try {
      const storedChat = localStorage.getItem(CHAT_HISTORY_KEY);
      
      if (storedChat) {
        const parsedChat = JSON.parse(storedChat);
        setChatMessages(parsedChat);
      } else {
        // No stored chat history, set improved welcome message with suggestions
        setChatMessages([{ 
          text: "Hi there! I'm your resume assistant. I can help you improve and customize your resume. Here are some ways to get started:\n\n• Paste in your existing resume and I'll help format it\n• Share a job description and I'll tailor your resume for it\n• Ask specific questions about improving sections of your resume\n\nWhat would you like help with today?", 
          sender: 'ai', 
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Reset to default improved message on error
      setChatMessages([{ 
        text: "Hi there! I'm your resume assistant. I can help you improve and customize your resume. Here are some ways to get started:\n\n• Paste in your existing resume and I'll help format it\n• Share a job description and I'll tailor your resume for it\n• Ask specific questions about improving sections of your resume\n\nWhat would you like help with today?", 
        sender: 'ai',
        timestamp: Date.now()
      }]);
    }
  };

  // Modified to save chat history independently from resume versions
  const saveChatHistory = (messages: AISuggestion[]) => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
      setSnackbarMessage('Error saving chat history');
      setSnackbarOpen(true);
    }
  };

  // Fetch user's resumes from localStorage on component mount
  useEffect(() => {
    fetchLocalResumes();
    loadChatHistory(); // Load chat history once on component mount
  }, []);

  // Save chat history when it changes
  useEffect(() => {
    if (chatMessages.length > 0) {
      saveChatHistory(chatMessages);
    }
  }, [chatMessages]);

  // Fetch and load resume versions from localStorage
  const fetchLocalResumes = () => {
    try {
      setResumeVersionsLoading(true);
      const storedResumes = localStorage.getItem('resumeVersions');
      
      if (storedResumes) {
        const parsedResumes = JSON.parse(storedResumes);
        
        if (parsedResumes && Array.isArray(parsedResumes) && parsedResumes.length > 0) {
          // Ensure there's always an active version
          let hasActiveVersion = parsedResumes.some((r: ResumeVersion) => r.isActive);
          
          if (!hasActiveVersion) {
            // Set the most recent version as active
            parsedResumes[0].isActive = true;
            localStorage.setItem('resumeVersions', JSON.stringify(parsedResumes));
          }
          
          // Find the active resume
          const activeResume = parsedResumes.find((r: ResumeVersion) => r.isActive) || parsedResumes[0];
          
          setResumeVersions(parsedResumes);
          
          if (activeResume && activeResume.content) {
            setJsonInput(JSON.stringify(activeResume.content, null, 2));
            setResumeData(activeResume.content);
            
            // We no longer load chat history based on the active resume version
          } else {
            // No valid content, load sample data
            loadSampleData();
          }
        } else {
          // Invalid stored resumes, load sample data
          loadSampleData();
        }
      } else {
        // No stored resumes, load sample data
        loadSampleData();
      }
    } catch (error) {
      console.error('Error loading resume versions:', error);
      loadSampleData();
    } finally {
      setResumeVersionsLoading(false);
    }
  };

  // Load sample resume data
  const loadSampleData = () => {
    fetch('/sampleResumeData.json')
      .then(response => response.json())
      .then(data => {
        const formattedJson = JSON.stringify(data, null, 2);
        setJsonInput(formattedJson);
        setResumeData(data);
        
        // Create a sample version if no versions exist
        if (resumeVersions.length === 0) {
          const sampleVersion = {
            id: 'sample',
            name: 'Sample Resume',
            dateModified: new Date().toISOString().split('T')[0],
            isActive: true,
            content: data
          };
          
          setResumeVersions([sampleVersion]);
          
          // Save to localStorage
          localStorage.setItem('resumeVersions', JSON.stringify([sampleVersion]));
        }
      })
      .catch(error => {
        console.error('Error loading sample JSON:', error);
        setErrorMessage('Could not load sample resume data.');
      });
  };

  // Fix the saveResumeToLocalStorage function to handle the new data structure
  const saveResumeToLocalStorage = (data: any) => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };

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
  const handleDownloadPdf = async () => {
    if (!resumeRef.current) return;
    
    // Show loading indicator
    setSnackbarMessage("Starting PDF generation...");
    setSnackbarOpen(true);
    
    try {
      // Show progress updates
      setTimeout(() => {
        setSnackbarMessage("Processing resume content...");
        
        setTimeout(async () => {
          setSnackbarMessage("Creating PDF document...");
          
          // Create a temporary, full-size copy of the resume with proper dimensions for PDF export
          const tempDiv = document.createElement('div');
          tempDiv.className = 'resume';
          tempDiv.style.width = '8.5in';
          tempDiv.style.height = '11in';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';  // Position off-screen
          tempDiv.style.fontFamily = '"EB Garamond", serif';
          tempDiv.style.padding = '0.5in';
          tempDiv.style.boxSizing = 'border-box';
          
          // Copy HTML content from the modal's full-size version
          if (resumeData) {
            // Create header content
            const headerHTML = `
              <div style="text-align: center; padding-bottom: 4px; margin-bottom: 8px">
                <h1 style="margin: 0; font-size: 16pt; font-weight: 600; letter-spacing: 0.5px">${resumeData.name}</h1>
                <p class="contact-info" style="margin: 3px 0; font-size: 10pt; line-height: 1">
                  <span>${resumeData.location}</span> | <span>${resumeData.phone}</span> | <span>${resumeData.email}</span>
                </p>
                ${resumeData.website && (
                  `<p style="margin: 2px 0; font-size: 10pt; line-height: 1">${resumeData.website}</p>`
                )}
              </div>
            `;
            
            // Get all sections from the resume
            const allSections = resumeRef.current?.querySelectorAll('.section') || [];
            const sectionsHTML = Array.from(allSections).map(section => section.outerHTML).join('');
            
            // Combine header and all sections
            tempDiv.innerHTML = `<div>${headerHTML}${sectionsHTML}</div>`;
            
            // Add additional styles for PDF export
            const styleElem = document.createElement('style');
            styleElem.textContent = `
              /* Base resume styling */
              .resume {
                font-family: "EB Garamond", "Garamond", serif !important;
                font-size: 10pt !important;
                line-height: 1 !important;
                color: #000000 !important;
              }
              
              /* List styling */
              ul { 
                margin: 0 !important;
                padding-left: 32px !important;
                list-style-type: disc !important;
                font-size: 10.5pt !important;
              }
              
              li {
                margin-bottom: 3px !important;
                line-height: 1 !important;
                padding-left: 24px !important;
                text-indent: -24px !important;
              }
              
              li strong {
                font-weight: 600 !important;
              }
              
              /* Job, project, and publication titles */
              .job-title, .project-title, .publication-title {
                font-weight: normal !important;
                font-size: 10pt !important;
              }
              
              /* Header spacing */
              div[style*="text-align: center"] {
                margin-bottom: 8px !important;
                padding-bottom: 4px !important;
              }
              
              /* Section headings */
              .section h2 {
                text-transform: uppercase !important;
                border-bottom: 1px solid #000000 !important;
                padding-bottom: 3px !important;
                margin-bottom: 6px !important;
                margin-top: 0 !important;
                font-size: 10pt !important;
                letter-spacing: 0.5px !important;
                font-weight: 600 !important;
              }
              
              /* Contact info spacing */
              .contact-info span {
                margin: 0 5px !important;
              }
              
              .contact-info span:first-child {
                margin-left: 0 !important;
              }
              
              .contact-info span:last-child {
                margin-right: 0 !important;
              }
              
              /* Technical skills spacing */
              .skills-container {
                display: grid !important;
                grid-template-columns: max-content 1fr !important;
                grid-gap: 2px 120px !important;
                width: 100% !important;
              }
              
              .skill-category-title {
                font-weight: 600 !important;
                padding-right: 5px !important;
              }
              
              .skill-items {
                padding-left: 0 !important;
              }
            `;
            tempDiv.appendChild(styleElem);
          }
          
          document.body.appendChild(tempDiv);
          
          try {
            // Capture the full-size resume
            const canvas = await html2canvas(tempDiv, {
              scale: 2, // Higher scale for better quality
              useCORS: true,
              logging: false,
              windowWidth: 816, // 8.5in in pixels at 96dpi
              windowHeight: 1056 // 11in in pixels at 96dpi
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            
            // Create PDF with correct dimensions (8.5 x 11 inches)
            const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'in',
              format: 'letter' // Standard US letter size
            });
            
            // Add the image to the PDF (with proper margins already handled by tempDiv padding)ww
            pdf.addImage(imgData, 'JPEG', 0, 0, 8.5, 11);
            
            // Save the PDF with the name of the person or "Resume"
            pdf.save(`${resumeData?.name || 'Resume'}.pdf`);
            
            setSnackbarMessage("PDF generated successfully!");
            setSnackbarOpen(true);
          } catch (error) {
            console.error("Error in PDF generation:", error);
            setSnackbarMessage("Error generating PDF. Please try again.");
            setSnackbarOpen(true);
          } finally {
            // Clean up - remove temp div
            document.body.removeChild(tempDiv);
          }
        }, 300);
      }, 200);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbarMessage("Error generating PDF. Please try again.");
      setSnackbarOpen(true);
    }
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
                <strong>{parseBulletText(edu.institution)}</strong>, {parseBulletText(edu.location)}
                <span className="date-range">{parseBulletText(edu.graduationDate)}</span><br />
                {parseBulletText(edu.degree)}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
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
                <span className="job-title">{parseBulletText(job.title)}</span>, {parseBulletText(job.company)}, {parseBulletText(job.location)}
                <span className="date-range">{parseBulletText(job.dateRange)}</span>
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
                <span className="project-title">{parseBulletText(project.name)}</span>
                <span className="date-range">{parseBulletText(project.dateRange)}</span>
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
                <span className="publication-title">{parseBulletText(pub.title)}</span>, {parseBulletText(pub.citation)}
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

  // Update the fetchOpenAIResponse function
  const fetchOpenAIResponse = async (userInput: string, resumeJson: string) => {
    try {
      setIsLoading(true);
      
      // Fetch system instructions from file
      let systemInstructions = "";
      try {
        const response = await fetch('/ai-resume-prompt.txt');
        if (!response.ok) {
          throw new Error('Failed to fetch AI prompt');
        }
        systemInstructions = await response.text();
      } catch (error) {
        console.error("Error loading AI prompt:", error);
        // Fallback instructions if file can't be loaded
        systemInstructions = `You are an AI assistant specifically designed to help users improve their résumés. 
Your task is to analyze the user's resume (provided as JSON) and respond to their questions or requests to modify the resume.

When suggesting modifications:
1. Only modify the JSON data, not the structure/schema
2. Your response must have two clearly separated parts:
   a. First, an explanation of what changes you made or your answer to the user's question
   b. Then, ONLY if you're modifying the resume, the full updated JSON on a new line starting with "JSON_START" and ending with "JSON_END"
3. Do not wrap your response in any code blocks or quotes`;
      }

      const contextString = buildContextString();
      console.log("contextString", contextString);
      console.log(systemInstructions + contextString);
      // Extract prior conversation for context (excluding AI suggestions JSON)
      const conversationHistory = chatMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n\n');
      
      // Instead of calling OpenAI directly, use our backend proxy
      const response = await axios.post(
        'https://backend-crimson-fog-1555.fly.dev/api/openai-proxy', // Update with your backend URL
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemInstructions + contextString
            },
            {
              role: "user",
              content: `Here is my resume in JSON format:\n\n${resumeJson}\n\nOur conversation history:\n${conversationHistory}\n\nUser's new request: ${userInput}`
            }
          ],
          temperature: 0.7,
          max_tokens: 32000
        }
      );

      // The rest of the function remains unchanged
      let responseText = response.data.choices[0].message.content;
      
      // Extract JSON if present, using JSON_START and JSON_END markers
      let jsonSuggestion = null;
      let displayText = responseText;
      
      if (responseText.includes("JSON_START") && responseText.includes("JSON_END")) {
        const jsonStart = responseText.indexOf("JSON_START");
        const jsonEnd = responseText.indexOf("JSON_END") + "JSON_END".length;
        
        if (jsonStart < jsonEnd) {
          // Extract the JSON part (including markers)
          const jsonPart = responseText.substring(jsonStart, jsonEnd);
          // Remove the JSON part from display text
          displayText = responseText.replace(jsonPart, "").trim();
          
          // Extract just the JSON content without markers
          const jsonContent = responseText.substring(jsonStart + "JSON_START".length, jsonEnd - "JSON_END".length).trim();
          try {
            // Validate that it's proper JSON by parsing it
            JSON.parse(jsonContent);
            jsonSuggestion = jsonContent;
          } catch (e) {
            console.error("Invalid JSON in response:", e);
          }
        }
      } else {
        // Try to extract JSON directly if no markers
        try {
          // Look for a JSON object in the text (imperfect but helpful as fallback)
          const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
          if (jsonMatch && jsonMatch.index !== undefined) {
            const jsonText = jsonMatch[0];
            const jsonStart = jsonMatch.index;
            const jsonEnd = jsonStart + jsonText.length;
            
            // Validate it's proper JSON
            JSON.parse(jsonText);
            jsonSuggestion = jsonText;
            
            // Remove the JSON part from display text
            displayText = responseText.substring(0, jsonStart).trim() + 
                          responseText.substring(jsonEnd).trim();
          }
        } catch (e) {
          console.error("Could not extract JSON from response:", e);
        }
      }
      
      // Only add the AI message to chat - user message is already added in handleSendMessage
      const aiMessage: AISuggestion = { 
        text: displayText, 
        sender: 'ai', 
        suggestion: jsonSuggestion,
        timestamp: Date.now()
      };
      
      setChatMessages(prevMessages => [...prevMessages, aiMessage]);
      
      setChatInput('');
      setIsLoading(false);
    
      // Scroll to the bottom of the chat
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // Only add error message - user message is already added in handleSendMessage
      const errorMessage: AISuggestion = { 
        text: "Sorry, I encountered an error while processing your request. Please try again later.", 
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
      setIsLoading(false);
    }
  };

  // Handle chat input submission
  const handleSendMessage = async () => {
    if (chatInput.trim() === '' || isLoading) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message to chat with timestamp
    const userChatMessage: AISuggestion = { 
      text: userMessage, 
      sender: 'user',
      timestamp: Date.now() 
    };
    
    setChatMessages(prevMessages => [...prevMessages, userChatMessage]);
    
    // Immediately scroll to bottom after adding user message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
    
    try {
      await fetchOpenAIResponse(userMessage, jsonInput);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Fix the mockAIResponseWithSuggestion function
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
            sender: 'ai',
            suggestion: JSON.stringify(improvedJSON, null, 2)
          };
        }
      } catch (error) {
        console.error("Error generating suggestion:", error);
      }
    }
    
    // Default response for other prompts
    return { 
      text: `This is a placeholder response to your question: "${prompt}". In the final implementation, this would be a tailored response from the OpenAI API.`, 
      sender: 'ai'
    };
  };

  // Apply AI suggestion JSON
  const handleApplySuggestion = (suggestionJSON: string) => {
    if (!suggestionJSON) {
      setSnackbarMessage("No valid JSON found in the suggestion.");
      setSnackbarOpen(true);
      setActiveSuggestion(null);
      return;
    }
    
    try {
      // Format the JSON with proper indentation
      const data = JSON.parse(suggestionJSON);
      const formattedJSON = JSON.stringify(data, null, 2);
      
      setJsonInput(formattedJSON);
      setResumeData(data);
      
      // Always clear the active suggestion to return to normal JSON editor
      setActiveSuggestion(null);
      
      // Remove suggestion from the message that contained it
      setChatMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.suggestion === suggestionJSON 
            ? { ...msg, suggestion: null } // Remove the suggestion
            : msg
        )
      );
      
      // Add a confirmation message to the chat
      const confirmationMessage: AISuggestion = { 
        text: "✅ Changes applied successfully! The resume has been updated with the suggested modifications.", 
        sender: 'ai',
        timestamp: Date.now()
      };
      setChatMessages(prevMessages => [...prevMessages, confirmationMessage]);
      
      // Scroll to the bottom of the chat to show the confirmation
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      setSnackbarMessage("AI suggestion applied successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error applying suggestion:", error);
      setErrorMessage("Could not apply the suggestion. Invalid JSON format.");
      setSnackbarOpen(true);
      
      // Add an error message to the chat
      const errorMessage: AISuggestion = { 
        text: "❌ Sorry, I couldn't apply those changes. The suggestion contains invalid JSON format.", 
        sender: 'ai',
        timestamp: Date.now()
      };
      setChatMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  // Reject AI suggestion
  const handleRejectSuggestion = () => {
    // Store the current activeSuggestion before clearing it
    const currentSuggestion = activeSuggestion;
    
    // Clear the active suggestion to return to normal JSON editor
    setActiveSuggestion(null);
    
    if (currentSuggestion) {
      // Remove suggestion from the message that contained it
      setChatMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.suggestion === currentSuggestion 
            ? { ...msg, suggestion: null } // Remove the suggestion
            : msg
        )
      );
    }
    
    // Add a rejection message to the chat
    const rejectionMessage: AISuggestion = { 
      text: "Got it! The suggestion has been rejected. Let me know if you need any other assistance.", 
      sender: 'ai',
      timestamp: Date.now()
    };
    setChatMessages(prevMessages => [...prevMessages, rejectionMessage]);
    
    // Scroll to the bottom of the chat to show the rejection message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    setSnackbarMessage("Suggestion rejected");
    setSnackbarOpen(true);
  };

  // Set active suggestion for diff view
  const handleViewSuggestion = (suggestionJSON: string | null) => {
    if (!suggestionJSON) {
      setSnackbarMessage("No valid JSON suggestion found in the AI response.");
      setSnackbarOpen(true);
      return;
    }
    setActiveSuggestion(suggestionJSON);
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

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Handle editor change
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setJsonInput(value);
      
      // Mark as having unsaved changes if it's different from saved version
      setHasUnsavedChanges(true);
      
      // Maintain the auto-refresh functionality
      if (autoRefresh) {
        try {
          const parsedJson = JSON.parse(value);
          setResumeData(parsedJson);
          setErrorMessage("");
        } catch (error) {
          // Don't update error message during auto-refresh to avoid flickering
          console.error("Error parsing JSON:", error);
        }
      }
    }
  };

  // Format JSON in the editor
  const formatJson = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  // Toggle editor theme
  const toggleEditorTheme = () => {
    setEditorTheme(editorTheme === "vs-dark" ? "vs-light" : "vs-dark");
  };

  // Handle file upload for context
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setSnackbarMessage(`File ${file.name} is too large. Maximum size is 5MB.`);
        setSnackbarOpen(true);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          setSnackbarMessage(`Could not read file ${file.name}.`);
          setSnackbarOpen(true);
          return;
        }
        
        const content = event.target.result;
        // Create preview (first ~100 chars)
        const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');
        
        // Add file to context
        setContextFiles(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            content: content,
            preview: preview,
            size: file.size,
            included: true
          }
        ]);
        
        setShowContextSection(true);
      };
      
      reader.onerror = () => {
        setSnackbarMessage(`Error reading file ${file.name}.`);
        setSnackbarOpen(true);
      };
      
      reader.readAsText(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Toggle file inclusion in context
  const toggleFileInclusion = (id: string) => {
    setContextFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, included: !file.included } : file
      )
    );
  };
  
  // Remove file from context
  const removeContextFile = (id: string) => {
    // Hide context section if only one file is left
    const updatedFiles = contextFiles.filter(file => file.id !== id);
    if (updatedFiles.length === 0) {
      setShowContextSection(false);
    }
    setContextFiles(updatedFiles);
  };
  
  // Build context string from included files
  const buildContextString = (): string => {
    if (contextFiles.length === 0) return '';
    
    const includedFiles = contextFiles.filter(file => file.included);
    if (includedFiles.length === 0) return '';
    
    let contextString = "\n\n--- ADDITIONAL CONTEXT ---\n";
    includedFiles.forEach(file => {
      contextString += `\n[${file.name}]:\n${file.content}\n`;
    });
    
    return contextString;
  };

  // Function to handle opening the full-screen preview
  const handleOpenFullScreen = () => {
    setOpenFullScreen(true);
  };

  // Function to handle closing the full-screen preview
  const handleCloseFullScreen = () => {
    setOpenFullScreen(false);
  };

  const processResumeHTML = () => {
    if (!resumeRef.current) return '';
    
    // Create a lightweight copy instead of full cloning
    const content = resumeRef.current.innerHTML;
    
    // Process bold formatting with regex instead of DOM manipulation
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Handle template selection (not functional yet)
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Resume version management functions
  const addNewVersion = async () => {
    try {
      // Fetch sample data for the new version
      const response = await fetch('/sampleResumeData.json');
      const sampleData = await response.json();
      
      // Create a new blank version
      const newVersion: ResumeVersion = {
        id: `resume-${Date.now()}`,
        name: 'New Resume',
        dateModified: new Date().toISOString().split('T')[0],
        isActive: true, // Set this version as active
        content: sampleData
      };
      
      // Make all other versions inactive
      const updatedVersions = resumeVersions.map(v => ({
        ...v,
        isActive: false
      }));
      
      // Add new version
      updatedVersions.push(newVersion);
      
      // Sort by date
      updatedVersions.sort((a, b) => 
        new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
      );
      
      // Save to localStorage
      localStorage.setItem('resumeVersions', JSON.stringify(updatedVersions));
      
      // Update state
      setResumeVersions(updatedVersions);
      
      // Load the new version content
      setResumeData(sampleData);
      setJsonInput(JSON.stringify(sampleData, null, 2));
      
      // No longer need to set up version-specific chat history
      
      setSnackbarMessage('New resume version created successfully');
      setSnackbarOpen(true);
      // Reset unsaved changes flag for the new version
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error creating new version:', error);
      setSnackbarMessage('Error creating new version');
      setSnackbarOpen(true);
    }
  };

  // Delete version
  const deleteVersion = async (id: string) => {
    // Prevent deleting the only version or active version
    const activeVersion = resumeVersions.find(v => v.isActive);
    if (resumeVersions.length <= 1 || (activeVersion && activeVersion.id === id)) {
      setSnackbarMessage("Cannot delete the only or active version");
      setSnackbarOpen(true);
      return;
    }
    
    try {
      // Remove from local state
      const updatedVersions = resumeVersions.filter(v => v.id !== id);
      
      // Save to localStorage
      localStorage.setItem('resumeVersions', JSON.stringify(updatedVersions));
      
      // No longer need to remove chat history for this version
      
      setResumeVersions(updatedVersions);
      setSnackbarMessage('Resume version deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting version:', error);
      setSnackbarMessage('Error deleting version');
      setSnackbarOpen(true);
    }
  };

  // Start rename version
  const startRenameVersion = (id: string) => {
    setEditingVersionId(id);
    const version = resumeVersions.find(v => v.id === id);
    if (version) {
      setNewVersionName(version.name);
    }
  };

  // Finish rename version
  const finishRenameVersion = async () => {
    if (editingVersionId && newVersionName.trim()) {
      try {
        // Update version locally
        const updatedVersions = resumeVersions.map(v => 
          v.id === editingVersionId 
            ? { ...v, name: newVersionName.trim() } 
            : v
        );
        
        // Save to localStorage
        localStorage.setItem('resumeVersions', JSON.stringify(updatedVersions));
        
        setResumeVersions(updatedVersions);
      } catch (error) {
        console.error('Error updating version name:', error);
      }
    }
    
    setEditingVersionId(null);
    setNewVersionName('');
  };

  // Cancel rename without saving
  const cancelRenameVersion = () => {
    setEditingVersionId(null);
    setNewVersionName('');
  };

  // Set active version
  const setActiveVersion = (id: string) => {
    // Check if there are unsaved changes in the current version
    if (hasUnsavedChanges) {
      // Ask user if they want to save changes before switching versions
      const confirmSwitch = window.confirm('You have unsaved changes. Do you want to save them before switching versions?');
      
      if (confirmSwitch) {
        try {
          // Parse JSON and save current version
          const currentData = JSON.parse(jsonInput);
          const activeVersion = resumeVersions.find(v => v.isActive);
          if (activeVersion) {
            saveResumeToLocalStorage(currentData);
          }
        } catch (error) {
          console.error('Error saving changes:', error);
          setSnackbarMessage('Error saving changes');
          setSnackbarOpen(true);
          return; // Stop the version switch if save fails
        }
      }
    }
    
    // Reset unsaved changes flag
    setHasUnsavedChanges(false);
    
    // Update active status in state
    const updatedVersions = resumeVersions.map(v => ({ 
      ...v, 
      isActive: v.id === id 
    }));
    
    // Save to localStorage
    localStorage.setItem('resumeVersions', JSON.stringify(updatedVersions));
    
    setResumeVersions(updatedVersions);
    
    // Find the selected version and load its data
    const selectedVersion = updatedVersions.find(v => v.id === id);
    if (selectedVersion && selectedVersion.content) {
      setResumeData(selectedVersion.content);
      setJsonInput(JSON.stringify(selectedVersion.content, null, 2));
      
      // No longer load chat history when switching versions
    }
  };

  // Enhance duplicateCurrentVersion to not copy chat history
  const duplicateCurrentVersion = async () => {
    try {
      // Find the active version
      const activeVersion = resumeVersions.find(v => v.isActive);
      
      if (activeVersion) {
        // Get current resume data
        const currentData = JSON.parse(jsonInput);
        
        // Create a name for the duplicate
        const duplicateName = `Copy of ${activeVersion.name}`;
        
        // Create new version
        const newVersion: ResumeVersion = {
          id: `resume-${Date.now()}`,
          name: duplicateName,
          dateModified: new Date().toISOString().split('T')[0],
          isActive: false, // Don't make active yet, but the user can click on it
          content: currentData
        };
        
        // Add to list
        const updatedVersions = [...resumeVersions, newVersion];
        
        // Sort by date
        updatedVersions.sort((a, b) => 
          new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
        );
        
        // Save to localStorage
        localStorage.setItem('resumeVersions', JSON.stringify(updatedVersions));
        
        // No longer copy chat history between versions
        
        setResumeVersions(updatedVersions);
        setSnackbarMessage('Resume duplicated successfully');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      setSnackbarMessage('Error duplicating resume');
      setSnackbarOpen(true);
    }
  };

  // Handle save changes button click
  const handleSaveChanges = () => {
    try {
      // Parse current JSON
      const currentData = JSON.parse(jsonInput);
      
      // Find the active version
      const activeVersion = resumeVersions.find(v => v.isActive);
      
      if (activeVersion && resumeData) {
        // Make sure updatedResumeData has all required properties from ResumeData interface
        const updatedResumeData: ResumeData = {
          ...resumeData,
          name: resumeData.name,
          location: resumeData.location,
          phone: resumeData.phone,
          email: resumeData.email,
          website: resumeData.website || '',
          versions: resumeData.versions.map((version) => 
            version.isActive 
              ? { ...version, content: currentData } 
              : version
          )
        };
        
        // Save to localStorage
        saveResumeToLocalStorage(updatedResumeData);
        
        // Update state
        setResumeData(updatedResumeData);
        setHasUnsavedChanges(false);
        
        // Show success message
        setSnackbarMessage('Changes saved successfully');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setSnackbarMessage('Error saving changes: Invalid JSON');
      setSnackbarOpen(true);
    }
  };

  // Handle refresh chat button click
  const handleRefreshChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history? This cannot be undone.")) {
      // Create a fresh AI welcome message with improved suggestions
      const initialMessage = {
        text: "Hi there! I'm your resume assistant. I can help you improve and customize your resume. Here are some ways to get started:\n\n• Paste in your existing resume and I'll help format it\n• Share a job description and I'll tailor your resume for it\n• Ask specific questions about improving sections of your resume\n\nWhat would you like help with today?",
        sender: 'ai' as const,
        timestamp: Date.now()
      };
      
      setChatMessages([initialMessage]);
      
      // Save to localStorage
      saveChatHistory([initialMessage]);
      
      setSnackbarMessage("Chat history cleared");
      setSnackbarOpen(true);
    }
  };

  // Add useEffect to auto-save when users navigate away from the page
  useEffect(() => {
    // Define beforeunload handler to save before closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Save changes automatically
        try {
          const currentData = JSON.parse(jsonInput);
          const activeVersion = resumeVersions.find(v => v.isActive);
          
          if (activeVersion) {
            saveResumeToLocalStorage(currentData);
          }
        } catch (error) {
          console.error('Error auto-saving before unload:', error);
        }
        
        // Ask user to confirm leaving
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, jsonInput, resumeVersions]);

  // Update the auto-save functionality with null checks
  useEffect(() => {
    if (!hasUnsavedChanges || !resumeData) return;
    
    const autoSaveTimer = setTimeout(() => {
      setIsAutoSaving(true);
      try {
        // Parse the JSON input
        const jsonData = JSON.parse(jsonInput);
        
        // Update resumeData with new content
        const updatedResumeData: ResumeData = {
          ...resumeData,
          name: resumeData.name,
          location: resumeData.location,
          phone: resumeData.phone,
          email: resumeData.email,
          website: resumeData.website || '',
          versions: resumeData.versions.map((version) => 
            version.isActive 
              ? { ...version, content: jsonData } 
              : version
          )
        };
        
        // Save to localStorage
        saveResumeToLocalStorage(updatedResumeData);
        
        // Update state
        setResumeData(updatedResumeData);
        setHasUnsavedChanges(false);
        
        // Show autosave message
        setSnackbarMessage('Changes auto-saved');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error auto-saving:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 2000); // Reduced to 2 seconds for more frequent auto-save since we rely entirely on auto-saving
    
    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges, resumeData, jsonInput]);

  // Create a custom auto-save snackbar component
  const AutoSaveSnackbar = () => (
    <Snackbar
      open={isAutoSaving}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{ 
        '& .MuiPaper-root': { 
          minWidth: 'auto',
          bgcolor: 'rgba(255,255,255,0.8)',
          color: 'black',
          border: '1px solid black',
          boxShadow: 'none',
          px: 1,
          py: 0.5
        }
      }}
      message={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} sx={{ color: 'black' }} />
          <Typography variant="caption">Auto-saving...</Typography>
        </Box>
      }
    />
  );
  
  // Keep reference for compatibility
  const saveCurrentChanges = handleSaveChanges;

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        mt: -2, 
        mb: -4, 
        px: { xs: 0.5, sm: 1 },
        width: '100%',
        maxWidth: '98vw'  // Use 98% of viewport width
      }}
    >
      {/* Hidden resume reference for PDF generation */}
      <div style={{ display: 'none' }}>
        <div ref={resumeRef} className="resume" style={{ width: '8.5in', height: '11in' }}>
          {resumeData && (
            <div>
              {/* Header */}
              <div style={{ textAlign: 'center', paddingBottom: '4px', marginBottom: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '16pt', fontWeight: 600, letterSpacing: '0.5px' }}>{resumeData.name}</h1>
                <p className="contact-info" style={{ margin: '3px 0', fontSize: '10pt', lineHeight: '1' }}>
                  <span>{resumeData.location}</span> | <span>{resumeData.phone}</span> | <span>{resumeData.email}</span>
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
          )}
        </div>
      </div>
      
      <Grid container spacing={2}>
        {/* Header row */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" className="manga-title" sx={{ 
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 'bold',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '100%',
                height: '3px',
                backgroundColor: 'black'
              }
            }}>
              Resume Builder
            </Typography>
            
            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Removed Download PDF button from here */}
            </Box>
          </Box>
          
          {/* Main toolbar area */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap'
          }}>
            {/* Left side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              {/* Auto Refresh toggle removed - always on */}
              
              {/* Copy to clipboard button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyToClipboard}
                sx={{ 
                  borderRadius: 0, 
                  borderColor: 'black',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderColor: 'black'
                  }
                }}
              >
                Copy JSON
              </Button>
              
              {/* Format JSON button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={formatJson}
                sx={{ 
                  borderRadius: 0, 
                  borderColor: 'black',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    borderColor: 'black'
                  }
                }}
              >
                Format JSON
              </Button>
            </Box>
              
            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Download PDF button moved here (replacing Duplicate Version) */}
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadPdf}
                  sx={{ 
                    borderRadius: 0, 
                    borderColor: 'black',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      borderColor: 'black'
                    }
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        {/* Main content area - now with 3 columns */}
        <Grid container item spacing={1} xs={12}>
          {/* Left column - Resume Versions */}
          <Grid item xs={12} md={2}>
            <Paper
              sx={{
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '70vh',
                overflowY: 'auto',
                borderRadius: 1,
                boxShadow: 'none'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1.5,
                px: 1
              }}>
                <Typography variant="h6" component="h2" className="manga-section-title" sx={{ fontSize: '1rem' }}>
                  Resume Versions
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={addNewVersion}
                  sx={{ 
                    minWidth: '40px', 
                    px: 1,
                    borderRadius: 0, // Sharp corners
                    borderColor: 'black',
                    '&:hover': {
                      bgcolor: 'grey.200',
                      borderColor: 'black'
                    }
                  }}
                >
                  + New
                </Button>
              </Box>
              
              {resumeVersionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box sx={{ mb: 1 }}>
                  {resumeVersions.map((version, index) => (
                    <Box
                      key={version.id}
                      sx={{
                        py: 0.75,
                        px: 1.5,
                        cursor: 'pointer',
                        mb: 0.5,
                        // Change from rounded corners to sharp corners
                        borderRadius: 0,
                        // Add a more defined border
                        border: '1px solid',
                        borderColor: version.isActive ? 'black' : 'transparent',
                        bgcolor: version.isActive ? 'grey.200' : 'transparent',
                        color: version.isActive ? 'text.primary' : 'text.primary',
                        '&:hover': {
                          bgcolor: version.isActive ? 'grey.300' : 'action.hover',
                          borderColor: 'black',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => setActiveVersion(version.id)}
                    >
                      {editingVersionId === version.id ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <TextField
                            size="small"
                            value={newVersionName}
                            onChange={(e) => setNewVersionName(e.target.value)}
                            autoFocus
                            fullWidth
                            variant="standard"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                finishRenameVersion();
                              }
                            }}
                            sx={{ ml: 0.5 }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              finishRenameVersion();
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <DoneIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelRenameVersion();
                            }}
                            sx={{ p: 0.5 }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
                          <Tooltip title={version.isActive && hasUnsavedChanges ? "Has unsaved changes" : ""} arrow placement="top">
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: version.isActive ? 500 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {version.name}{version.isActive && hasUnsavedChanges ? " *" : ""}
                            </Typography>
                          </Tooltip>
                          
                          <Box 
                            sx={{ 
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              display: 'flex',
                              ml: 'auto'
                            }}
                            className="version-actions"
                          >
                            {!version.isActive && (
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteVersion(version.id);
                                }}
                                sx={{ p: 0.5 }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                startRenameVersion(version.id);
                              }}
                              sx={{ p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              
              <Box sx={{ mt: 'auto', pt: 1, px: 1 }}>
                {/* Showing auto-save status */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  {isAutoSaving && (
                    <Typography variant="caption" sx={{ ml: 'auto', mr: 1, fontStyle: 'italic', opacity: 0.7 }}>
                      Auto-saving...
                    </Typography>
                  )}
                  {hasUnsavedChanges && !isAutoSaving && (
                    <Typography variant="caption" sx={{ ml: 'auto', mr: 1, fontStyle: 'italic', opacity: 0.7 }}>
                      Unsaved changes
                    </Typography>
                  )}
                </Box>
                
                {/* Save Version button removed - using auto-save only */}
              </Box>
            </Paper>
          </Grid>

          {/* Middle column - JSON Editor */}
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 1.5, 
                display: 'flex', 
                flexDirection: 'column', 
                height: '70vh',
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1,
                px: 0.5
              }}>
                <Typography variant="h6" component="h2" className="manga-section-title" sx={{ fontSize: '1rem' }}>
                  JSON Editor
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip 
                    title="Format JSON" 
                    arrow 
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'white',
                          color: 'black', 
                          border: '1px solid black',
                          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                        }
                      },
                      arrow: {
                        sx: {
                          color: 'white',
                          '&:before': {
                            border: '1px solid black'
                          }
                        }
                      }
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={formatJson}
                      disabled={!!errorMessage}
                      sx={{ 
                        mr: 0.5,
                        '&:hover': {
                          bgcolor: 'grey.200',
                          '& .MuiSvgIcon-root': {
                            color: 'black'
                          }
                        }
                      }}
                    >
                      <CodeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip 
                    title="Copy to clipboard" 
                    arrow 
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'white',
                          color: 'black', 
                          border: '1px solid black',
                          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                        }
                      },
                      arrow: {
                        sx: {
                          color: 'white',
                          '&:before': {
                            border: '1px solid black'
                          }
                        }
                      }
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={handleCopyToClipboard}
                      sx={{ 
                        mr: 0.5,
                        '&:hover': {
                          bgcolor: 'grey.200',
                          '& .MuiSvgIcon-root': {
                            color: 'black'
                          }
                        }
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip 
                    title="Preview resume" 
                    arrow 
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'white',
                          color: 'black', 
                          border: '1px solid black',
                          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                        }
                      },
                      arrow: {
                        sx: {
                          color: 'white',
                          '&:before': {
                            border: '1px solid black'
                          }
                        }
                      }
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={handleOpenFullScreen}
                      disabled={!!errorMessage}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              {activeSuggestion ? (
                <Box sx={{ 
                  height: 'calc(100% - 100px)', 
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }}>
                  <Box sx={{ 
                    px: 1.5, 
                    py: 1, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100'
                  }}>
                    <Typography variant="subtitle2">
                      AI Suggested Changes
                    </Typography>
                    <Box>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => {
                          handleApplySuggestion(activeSuggestion);
                        }}
                        startIcon={<DoneIcon />}
                        sx={{ 
                          mr: 1, 
                          fontSize: '0.75rem', 
                          py: 0.5,
                          bgcolor: 'black',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'grey.800'
                          }
                        }}
                      >
                        Apply
                      </Button>
                      <IconButton 
                        size="small" 
                        onClick={handleRejectSuggestion}
                        sx={{ p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <ReactDiffViewer
                    oldValue={jsonInput}
                    newValue={activeSuggestion}
                    splitView={true}
                    showDiffOnly={false}
                    useDarkTheme={editorTheme === "vs-dark"}
                    leftTitle="Current Resume"
                    rightTitle="AI Suggestion"
                    styles={{
                      contentText: {
                        fontSize: '12px'
                      }
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ 
                  height: 'calc(100% - 100px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  overflow: 'hidden'
                }}>
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={jsonInput}
                    theme={editorTheme}
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 12,
                      folding: true,
                      foldingHighlight: true,
                      lineNumbers: 'on',
                      renderLineHighlight: 'line',
                      scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8
                      }
                    }}
                    onChange={(value) => {
                      setJsonInput(value || "");
                      try {
                        const parsedData = JSON.parse(value || "{}");
                        setResumeData(parsedData);
                        setErrorMessage("");
                      } catch (error) {
                        if (error instanceof Error) {
                          setErrorMessage(error.message);
                        }
                      }
                    }}
                    onMount={handleEditorDidMount}
                  />
                </Box>
              )}
              
              {errorMessage ? (
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: 'error.light', 
                    color: 'error.contrastText',
                    fontSize: '0.75rem',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', mr: 1 }}>
                    <ErrorIcon fontSize="small" />
                  </Box>
                  {errorMessage}
                </Box>
              ) : (
                <Box sx={{ height: '0px', mb: 1 }} />
              )}
              
              {/* File Upload Section */}
              <Box sx={{ 
                borderTop: '1px solid',
                borderColor: 'divider', 
                pt: 1 
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 1,
                  px: 0.5
                }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '0.75rem' }}>
                    Context Files
                  </Typography>
                  <Tooltip title="Upload context files for AI" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                      color="primary"
                    >
                      <FileUploadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    aria-label="Upload context files"
                  />
                </Box>
                
                {showContextSection && (
                  <Box sx={{ 
                    maxHeight: '80px', 
                    overflowY: 'auto',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 0.5
                  }}>
                    {contextFiles.map((file) => (
                      <Box 
                        key={file.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 0.5,
                          borderRadius: 0.5,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <DescriptionIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box sx={{ 
                          flex: 1, 
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            {(file.size / 1024).toFixed(1)} KB
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleFileInclusion(file.id)}
                            sx={{ p: 0.5 }}
                          >
                            {file.included ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => removeContextFile(file.id)}
                            sx={{ p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right column - Chat */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ 
                p: 1.5,
                height: '70vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 1.5,
                px: 1
              }}>
                <Typography variant="h6" component="h2" className="manga-section-title" sx={{ fontSize: '1rem' }}>
                  AI Resume Assistant
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRefreshChat}
                  title="Clear chat history"
                  sx={{ 
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'grey.200'
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Chat Messages */}
              <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                mb: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1.5,
                backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
              }}>
                {chatMessages.map((message, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1.5
                    }}
                  >
                    <Paper 
                      elevation={1}
                      className={message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}
                      sx={{
                        p: 1.5,
                        maxWidth: '85%',
                        borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: message.sender === 'user' ? 'grey.200' : 'background.paper',
                        border: theme => `1px solid ${theme.palette.divider}`,
                        position: 'relative'
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message.text}</Typography>
                      
                      {message.suggestion && (
                        <Box sx={{ 
                          mt: 1.5, 
                          pt: 1, 
                          borderTop: '1px dashed',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                            Suggested changes available
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                if (message.suggestion) {
                                  handleViewSuggestion(message.suggestion);
                                }
                              }}
                              sx={{ 
                                py: 0.5, 
                                px: 1,
                                fontSize: '0.75rem',
                                borderRadius: '14px',
                                textTransform: 'none',
                                borderColor: 'grey.500',
                                color: 'grey.800'
                              }}
                            >
                              View Changes
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => message.suggestion && handleApplySuggestion(message.suggestion)}
                              startIcon={<DoneIcon sx={{ fontSize: '0.9rem' }} />}
                              sx={{ 
                                py: 0.5, 
                                px: 1,
                                fontSize: '0.75rem',
                                borderRadius: '14px',
                                textTransform: 'none',
                                bgcolor: 'black',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'grey.800'
                                }
                              }}
                            >
                              Apply
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                ))}
                
                {isLoading && (
                  <Box 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'flex-start',
                      mb: 1.5
                    }}
                  >
                    <Paper 
                      elevation={1}
                      sx={{
                        p: 2,
                        width: '60%',
                        maxWidth: '85%',
                        borderRadius: '18px 18px 18px 4px',
                        bgcolor: 'background.paper',
                        border: theme => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'grey.600',
                              animation: 'pulse 1.5s infinite ease-in-out',
                              '@keyframes pulse': {
                                '0%': { opacity: 0.4 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.4 }
                              }
                            }}
                          />
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'grey.600',
                              animation: 'pulse 1.5s infinite ease-in-out',
                              animationDelay: '0.3s'
                            }}
                          />
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'grey.600',
                              animation: 'pulse 1.5s infinite ease-in-out',
                              animationDelay: '0.6s'
                            }}
                          />
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ ml: 1, fontStyle: 'italic' }}
                        >
                          Analyzing your resume...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Chat Input - Modified to remove send button and reduce text size */}
              <Box sx={{ display: 'flex', gap: 1, position: 'relative' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={isLoading ? "Waiting for response..." : "Ask a question... (press Enter to send)"}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && chatInput.trim() !== '' && handleSendMessage()}
                  disabled={isLoading}
                  InputProps={{
                    sx: { 
                      fontSize: '0.8rem', // Reduced text size
                      borderRadius: '20px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black'
                      }
                    }
                  }}
                />
              </Box>
              
              {/* Quick Prompts - Removing this section
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.75, 
                mt: 1.5,
                justifyContent: 'center'
              }}>
                <Chip
                  label="Improve my experience section"
                  size="small"
                  onClick={() => {
                    setChatInput("Can you help improve my experience section with more impactful language?");
                    handleSendMessage();
                  }}
                  sx={{ 
                    borderRadius: '12px',
                    fontWeight: 400,
                    '&:hover': { bgcolor: 'grey.300', color: 'text.primary' }
                  }}
                />
                <Chip
                  label="Tailor for tech roles"
                  size="small"
                  onClick={() => {
                    setChatInput("Help me tailor this resume for technical software engineering roles");
                    handleSendMessage();
                  }}
                  sx={{ 
                    borderRadius: '12px',
                    fontWeight: 400,
                    '&:hover': { bgcolor: 'grey.300', color: 'text.primary' }
                  }}
                />
                <Chip
                  label="Add skills section"
                  size="small"
                  onClick={() => {
                    setChatInput("Create a skills section for my resume");
                    handleSendMessage();
                  }}
                  sx={{ 
                    borderRadius: '12px',
                    fontWeight: 400,
                    '&:hover': { bgcolor: 'grey.300', color: 'text.primary' }
                  }}
                />
              </Box>
              */}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Full-screen modal for resume preview */}
      <Modal
        open={openFullScreen}
        onClose={handleCloseFullScreen}
        aria-labelledby="fullscreen-resume-preview"
        aria-describedby="view-resume-in-full-screen"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          p: 4,
          width: '90%',
          height: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" component="h2">
              Resume Preview
            </Typography>
            <Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<DownloadIcon sx={{ color: 'white' }} />}
                onClick={handleDownloadPdf}
                sx={{ 
                  mr: 1,
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'grey.800'
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }}
              >
                Download PDF
              </Button>
              <IconButton 
                onClick={handleCloseFullScreen}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt: 2,
            bgcolor: '#f5f5f5'
          }}>
            <Box sx={{ 
              width: '8.5in',
              height: '11in',
              bgcolor: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="resume" style={{ width: '100%', height: '100%' }}>
                {resumeData && (
                  <div>
                    {/* Header */}
                    <div style={{ textAlign: 'center', paddingBottom: '4px', marginBottom: '8px' }}>
                      <h1 style={{ margin: 0, fontSize: '16pt', fontWeight: 600, letterSpacing: '0.5px' }}>{resumeData.name}</h1>
                      <p className="contact-info" style={{ margin: '3px 0', fontSize: '10pt', lineHeight: '1' }}>
                        <span>{resumeData.location}</span> | <span>{resumeData.phone}</span> | <span>{resumeData.email}</span>
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
                )}
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Auto-save Snackbar */}
      <AutoSaveSnackbar />
      
      {/* Main Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ResumeBuilder; 