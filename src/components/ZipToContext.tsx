import React, { useState } from "react";
import axios from "axios";
import { 
  Button, 
  Container, 
  Typography, 
  Box, 
  Paper,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface ZipItem {
  filename: string;
  is_dir: boolean;
  file_size: number;
  line_count: number;
  omitted_due_to_size: boolean;
  text_extracted: string | null;
  note: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zipStructure, setZipStructure] = useState<ZipItem[]>([]);
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedZipItem, setSelectedZipItem] = useState<ZipItem | null>(null);
  const [hideUnsupported, setHideUnsupported] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editableContent, setEditableContent] = useState<string>("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select a ZIP file first.");
      return;
    }
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("https://backend-crimson-fog-1555.fly.dev/upload-zip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      setZipStructure(data.structure);
      setDownloadId(data.downloadId);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Error uploading file");
    }
  };

  // Modify handleDownload to use editableContent
  const handleDownload = () => {
    const blob = new Blob([editableContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'context.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Get file type icon based on extension
  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop() || '';
    
    // Media files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) return '🖼️';
    if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return '🎥';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵';
    if (ext === 'pdf') return '📕';
    
    // Text/code files
    if (['txt', 'md', 'json', 'xml', 'csv'].includes(ext)) return '📄';
    if (['js', 'ts', 'py', 'java', 'cpp', 'html', 'css'].includes(ext)) return '📝';
    
    // Default
    return '📄';
  };

  // Get the last part of the path for display
  const getDisplayName = (filename: string, level: number) => {
    const parts = filename.split('/');
    // If it's the last part and it's empty (happens with directory paths ending in /), 
    // take the second to last part
    if (level === parts.length - 1 && parts[parts.length - 1] === '') {
      return parts[parts.length - 2] || '';
    }
    return parts[level] || '';
  };

  // Add this new function to check if an item is within a directory
  const isItemInDirectory = (itemPath: string, dirPath: string): boolean => {
    return itemPath.startsWith(dirPath) && itemPath !== dirPath;
  };

  // Modify getDirectoryContent to use selectedItems
  const getDirectoryContent = (dirPath: string): string => {
    const filesInDir = zipStructure.filter(item => 
      isItemInDirectory(item.filename, dirPath) && 
      !item.is_dir && 
      item.text_extracted &&
      selectedItems.has(item.filename)
    );

    if (filesInDir.length === 0) {
      return "No readable text content in this directory";
    }

    return filesInDir.map(file => 
      `=== ${file.filename} ===\n${file.text_extracted}\n\n`
    ).join('');
  };

  // Modify getAllContent to use selectedItems
  const getAllContent = (): string => {
    const allFiles = zipStructure.filter(item => 
      !item.is_dir && 
      item.text_extracted &&
      selectedItems.has(item.filename)
    );

    if (allFiles.length === 0) {
      return "No readable text content found";
    }

    return allFiles.map(file => 
      `=== ${file.filename} ===\n${file.text_extracted}\n\n`
    ).join('');
  };

  // Add this new function to handle item selection
  const handleItemClick = (item: ZipItem) => {
    setSelectedZipItem(item);
    const newSelectedItems = new Set(selectedItems);

    if (item.filename === '[Everything]') {
      if (selectedItems.has('[Everything]')) {
        // Deselect everything
        newSelectedItems.clear();
      } else {
        // Select everything
        newSelectedItems.add('[Everything]');
        zipStructure.forEach(zi => newSelectedItems.add(zi.filename));
      }
    } else if (item.is_dir) {
      if (selectedItems.has(item.filename)) {
        // Deselect directory and all its contents
        newSelectedItems.delete(item.filename);
        zipStructure.forEach(zi => {
          if (isItemInDirectory(zi.filename, item.filename)) {
            newSelectedItems.delete(zi.filename);
          }
        });
      } else {
        // Select directory and all its contents
        newSelectedItems.add(item.filename);
        zipStructure.forEach(zi => {
          if (isItemInDirectory(zi.filename, item.filename)) {
            newSelectedItems.add(zi.filename);
          }
        });
      }
    } else {
      // Toggle individual file selection
      if (selectedItems.has(item.filename)) {
        newSelectedItems.delete(item.filename);
      } else {
        newSelectedItems.add(item.filename);
      }
    }

    setSelectedItems(newSelectedItems);
  };

  // Simple function to display item in a "tree-like" style
  const renderZipItem = (item: ZipItem) => {
    const parts = item.filename.split("/");
    const indentLevel = parts.length - 1;
    const indentation = Array(indentLevel).fill("—").join("");
    
    const displayName = getDisplayName(item.filename, indentLevel);

    const isUnsupported = !item.is_dir && !item.text_extracted && item.note.includes("unsupported format");
    let textColor = "black";
    if (item.omitted_due_to_size) {
      textColor = "red";
    } else if (isUnsupported) {
      textColor = "orange";
    }

    const icon = item.is_dir ? "📁" : getFileIcon(item.filename);

    return (
      <div
        key={item.filename}
        style={{ 
          marginLeft: indentLevel * 20, 
          color: textColor,
          cursor: 'pointer',
          backgroundColor: selectedItems.has(item.filename) ? '#e6e6e6' : 'transparent',
          padding: '2px 5px',
          borderRadius: '3px'
        }}
        onClick={() => handleItemClick(item)}
      >
        {indentation}{" "}
        {item.is_dir
          ? `${icon} [Directory] ${displayName}`
          : `${icon} ${displayName} (${item.line_count} lines)`}
    
        {item.omitted_due_to_size && <span style={{ color: "red" }}> [Omitted due to size]</span>}
        {isUnsupported && <span style={{ color: "orange" }}> [Unsupported format]</span>}
      </div>
    );
  };

  // Update editableContent whenever selections change
  React.useEffect(() => {
    setEditableContent(getAllContent());
  }, [selectedItems]);

  // Add function to count lines
  const getLineCount = (text: string): number => {
    return text.split('\n').length;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ZIP to Context
        </Typography>
        
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>How to Use This Tool</Typography>
          <Typography variant="body1" paragraph>
            This tool helps you easily provide code context to Large Language Models (LLMs) like ChatGPT, Claude, or Bard:
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>Upload a ZIP file containing your codebase or project files</Box>
            <Box component="li" sx={{ mb: 1 }}>Browse and select the files you want to include as context</Box>
            <Box component="li" sx={{ mb: 1 }}>Edit the generated context text if needed</Box>
            <Box component="li" sx={{ mb: 1 }}>Download the context as a text file or copy it directly to your clipboard</Box>
            <Box component="li">Paste the context into your LLM conversation for more accurate and relevant responses</Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            The tool automatically formats your code files with clear headers and skips binary or unsupported files to ensure optimal context quality.
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ minWidth: '150px' }}
          >
            Choose File
            <input type="file" accept=".zip" onChange={handleFileChange} hidden />
          </Button>
          {selectedFile && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {selectedFile.name}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
            sx={{ minWidth: '150px' }}
          >
            {zipStructure.length > 0 ? 'Refresh' : 'Upload ZIP'}
          </Button>
        </Stack>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 0,
          mt: 0 
        }}>
          <Button
            variant="outlined"
            onClick={() => setHideUnsupported(!hideUnsupported)}
            startIcon={hideUnsupported ? <VisibilityIcon /> : <VisibilityOffIcon />}
          >
            {hideUnsupported ? 'Show' : 'Hide'} Unsupported Files
          </Button>
          <Box sx={{ color: 'text.secondary', fontSize: '0.9em', textAlign: 'right' }}>
            <Box component="div">🔴 Red: File too large to process</Box>
            <Box component="div">🟠 Orange: Unsupported file format</Box>
          </Box>
        </Box>
      </Paper>

      {errorMessage && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: '#fff4f4' }}>
          <Typography color="error">{errorMessage}</Typography>
        </Paper>
      )}

      {zipStructure.length > 0 && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Typography variant="h5" component="h2">
              File Structure
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
              disabled={selectedItems.size === 0}
            >
              Download Selected Content
            </Button>
          </Box>
          <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 250px)' }}>
            <div style={{ 
              flex: '0 0 400px', 
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px'
            }}>
              {/* Add the Everything directory */}
              <div
                style={{ 
                  color: 'black',
                  cursor: 'pointer',
                  backgroundColor: selectedItems.has('[Everything]') ? '#e6e6e6' : 'transparent',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  marginBottom: '8px'
                }}
                onClick={() => handleItemClick({
                  filename: '[Everything]',
                  is_dir: true,
                  file_size: 0,
                  line_count: 0,
                  omitted_due_to_size: false,
                  text_extracted: null,
                  note: ''
                })}
              >
                📁 [Directory] Everything
              </div>
              {zipStructure
                .filter(item => {
                  if (!hideUnsupported) return true;
                  const isUnsupported = !item.is_dir && !item.text_extracted && item.note.includes("unsupported format");
                  return !(isUnsupported || item.omitted_due_to_size);
                })
                .map((item) => renderZipItem(item))
              }
            </div>
            
            <div style={{ 
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
            }}>
              {selectedItems.size > 0 ? (
                <>
                  <div style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #ccc',
                    fontSize: '0.9em',
                    color: '#666',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Lines: {getLineCount(editableContent)}</span>
                  </div>
                  <div style={{ flex: 1, padding: '10px' }}>
                    <textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: 'monospace',
                        resize: 'none',
                        outline: 'none'
                      }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ color: 'gray', fontStyle: 'italic', padding: '10px' }}>
                  Select files to view their contents
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default App;