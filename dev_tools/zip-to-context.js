// ZIP to Context Converter - Vanilla JavaScript Implementation

// Types definition for reference
/**
 * @typedef {Object} ZipItem
 * @property {string} filename
 * @property {boolean} is_dir
 * @property {number} file_size
 * @property {number} line_count
 * @property {boolean} omitted_due_to_size
 * @property {string|null} text_extracted
 * @property {string} note
 */

// Global state
const state = {
    selectedFile: null,
    zipStructure: [],
    downloadId: null,
    errorMessage: "",
    selectedZipItem: null,
    hideUnsupported: true,
    selectedItems: new Set(),
    editableContent: "",
    isUploading: false
};

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    const fileInput = document.getElementById('file-input');
    const chooseFileBtn = document.getElementById('choose-file');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');
    const toggleUnsupportedBtn = document.getElementById('toggle-unsupported');
    const visibilityText = document.getElementById('visibility-text');
    const errorContainer = document.getElementById('error-container');
    const fileStructureSection = document.getElementById('file-structure');
    const fileTree = document.getElementById('file-tree');
    const downloadBtn = document.getElementById('download-btn');
    const contentArea = document.getElementById('content-area');
    const lineCount = document.getElementById('line-count');
    const themeToggle = document.getElementById('theme-toggle');

    // Event Listeners
    chooseFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileChange);
    uploadBtn.addEventListener('click', handleUpload);
    toggleUnsupportedBtn.addEventListener('click', toggleUnsupportedFiles);
    downloadBtn.addEventListener('click', handleDownload);
    contentArea.addEventListener('input', handleContentChange);

    // Functions
    /**
     * Handle file selection
     */
    function handleFileChange(event) {
        if (event.target.files && event.target.files.length > 0) {
            state.selectedFile = event.target.files[0];
            fileNameDisplay.textContent = state.selectedFile.name;
            uploadBtn.disabled = false;
        }
    }

    /**
     * Toggle showing unsupported files
     */
    function toggleUnsupportedFiles() {
        state.hideUnsupported = !state.hideUnsupported;
        visibilityText.textContent = state.hideUnsupported ? 'Show' : 'Hide';
        renderFileTree();
    }

    /**
     * Handle content area changes
     */
    function handleContentChange(event) {
        state.editableContent = event.target.value;
        updateLineCount();
    }

    /**
     * Update line count display
     */
    function updateLineCount() {
        const lines = state.editableContent.split('\n').length;
        lineCount.textContent = `Lines: ${lines}`;
    }

    /**
     * Upload file to server
     */
    async function handleUpload() {
        if (!state.selectedFile) {
            showError("Please select a ZIP file first.");
            return;
        }
        
        clearError();
        state.isUploading = true;
        uploadBtn.textContent = 'Uploading...';
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append("file", state.selectedFile);

        try {
            const response = await fetch("https://backend-crimson-fog-1555.fly.dev/upload-zip", {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to upload file");
            }
            
            const data = await response.json();
            state.zipStructure = data.structure;
            state.downloadId = data.downloadId;
            
            // Show file structure section
            fileStructureSection.classList.remove('hidden');
            
            // Add "Everything" as a virtual item
            renderFileTree();
            
        } catch (error) {
            console.error(error);
            showError("Error uploading file: " + (error.message || "Unknown error"));
        } finally {
            state.isUploading = false;
            uploadBtn.textContent = state.zipStructure.length > 0 ? 'Refresh' : 'Upload ZIP';
            uploadBtn.disabled = false;
        }
    }

    /**
     * Download selected content
     */
    function handleDownload() {
        const blob = new Blob([state.editableContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'context.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Get file type icon based on extension
     */
    function getFileIcon(filename) {
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
    }

    /**
     * Get the last part of the path for display
     */
    function getDisplayName(filename, level) {
        const parts = filename.split('/');
        // If it's the last part and it's empty (happens with directory paths ending in /), 
        // take the second to last part
        if (level === parts.length - 1 && parts[parts.length - 1] === '') {
            return parts[parts.length - 2] || '';
        }
        return parts[level] || '';
    }

    /**
     * Check if an item is within a directory
     */
    function isItemInDirectory(itemPath, dirPath) {
        return itemPath.startsWith(dirPath) && itemPath !== dirPath;
    }

    /**
     * Handle item selection
     */
    function handleItemClick(item) {
        state.selectedZipItem = item;
        const newSelectedItems = new Set(state.selectedItems);

        if (item.filename === '[Everything]') {
            if (state.selectedItems.has('[Everything]')) {
                // Deselect everything
                newSelectedItems.clear();
            } else {
                // Select everything
                newSelectedItems.add('[Everything]');
                state.zipStructure.forEach(zi => newSelectedItems.add(zi.filename));
            }
        } else if (item.is_dir) {
            if (state.selectedItems.has(item.filename)) {
                // Deselect directory and all its contents
                newSelectedItems.delete(item.filename);
                state.zipStructure.forEach(zi => {
                    if (isItemInDirectory(zi.filename, item.filename)) {
                        newSelectedItems.delete(zi.filename);
                    }
                });
            } else {
                // Select directory and all its contents
                newSelectedItems.add(item.filename);
                state.zipStructure.forEach(zi => {
                    if (isItemInDirectory(zi.filename, item.filename)) {
                        newSelectedItems.add(zi.filename);
                    }
                });
            }
        } else {
            // Toggle individual file selection
            if (state.selectedItems.has(item.filename)) {
                newSelectedItems.delete(item.filename);
            } else {
                newSelectedItems.add(item.filename);
            }
        }

        state.selectedItems = newSelectedItems;
        updateEditableContent();
        renderFileTree();
        
        // Enable/disable download button based on selection
        downloadBtn.disabled = state.selectedItems.size === 0;
    }

    /**
     * Show error message
     */
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }

    /**
     * Clear error message
     */
    function clearError() {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
    }

    /**
     * Get content from selected items
     */
    function getAllContent() {
        const allFiles = state.zipStructure.filter(item => 
            !item.is_dir && 
            item.text_extracted &&
            state.selectedItems.has(item.filename)
        );

        if (allFiles.length === 0) {
            return "No readable text content found";
        }

        return allFiles.map(file => 
            `=== ${file.filename} ===\n${file.text_extracted}\n\n`
        ).join('');
    }

    /**
     * Update editable content when selections change
     */
    function updateEditableContent() {
        state.editableContent = getAllContent();
        contentArea.value = state.editableContent;
        updateLineCount();
    }

    /**
     * Render file tree based on current state
     */
    function renderFileTree() {
        // Clear the file tree
        fileTree.innerHTML = '';
        
        // Add the Everything directory
        const everythingDiv = document.createElement('div');
        everythingDiv.className = `file-item ${state.selectedItems.has('[Everything]') ? 'selected' : ''}`;
        
        // Add selection indicator for Everything
        const everythingIndicator = document.createElement('div');
        everythingIndicator.className = `selection-indicator ${state.selectedItems.has('[Everything]') ? 'selected' : ''}`;
        everythingIndicator.innerHTML = state.selectedItems.has('[Everything]') ? '✓' : '';
        everythingDiv.appendChild(everythingIndicator);
        
        // Use a text node instead of textContent to preserve the indicator
        const everythingLabel = document.createTextNode('📁 [Directory] Everything');
        everythingDiv.appendChild(everythingLabel);
        
        everythingDiv.addEventListener('click', () => {
            handleItemClick({
                filename: '[Everything]',
                is_dir: true,
                file_size: 0,
                line_count: 0,
                omitted_due_to_size: false,
                text_extracted: null,
                note: ''
            });
        });
        fileTree.appendChild(everythingDiv);
        
        // Add all other items
        state.zipStructure
            .filter(item => {
                if (!state.hideUnsupported) return true;
                const isUnsupported = !item.is_dir && !item.text_extracted && item.note.includes("unsupported format");
                return !(isUnsupported || item.omitted_due_to_size);
            })
            .forEach(item => {
                const parts = item.filename.split("/");
                const indentLevel = parts.length - 1;
                const indentation = Array(indentLevel).fill("—").join("");
                
                const displayName = getDisplayName(item.filename, indentLevel);
                
                // Determine text color
                let textColor = '';
                if (item.omitted_due_to_size) {
                    textColor = 'text-color-error';
                } else if (!item.is_dir && !item.text_extracted && item.note.includes("unsupported format")) {
                    textColor = 'text-color-warning';
                }
                
                const icon = item.is_dir ? "📁" : getFileIcon(item.filename);
                
                const itemDiv = document.createElement('div');
                itemDiv.className = `file-item ${state.selectedItems.has(item.filename) ? 'selected' : ''} ${textColor}`;
                
                // Apply indentation based on whether it's a file or directory
                const adjustedIndent = item.is_dir ? indentLevel : indentLevel + 1;
                itemDiv.style.marginLeft = `${adjustedIndent * 20}px`;
                
                // Add selection indicator
                const indicator = document.createElement('div');
                indicator.className = `selection-indicator ${state.selectedItems.has(item.filename) ? 'selected' : ''}`;
                indicator.innerHTML = state.selectedItems.has(item.filename) ? '✓' : '';
                itemDiv.appendChild(indicator);
                
                // Also adjust the text indentation dash characters to match visual indentation
                const textIndent = item.is_dir 
                    ? indentation 
                    : Array(indentLevel + 1).fill("—").join("");
                
                // Use text node instead of textContent to preserve the indicator
                const itemText = document.createTextNode(item.is_dir
                    ? `${textIndent} ${icon} [Directory] ${displayName}`
                    : `${textIndent} ${icon} ${displayName} (${item.line_count} lines)`);
                itemDiv.appendChild(itemText);
                
                if (item.omitted_due_to_size) {
                    const omittedSpan = document.createElement('span');
                    omittedSpan.textContent = ' [Omitted due to size]';
                    omittedSpan.className = 'text-color-error file-note';
                    itemDiv.appendChild(omittedSpan);
                }
                
                if (!item.is_dir && !item.text_extracted && item.note.includes("unsupported format")) {
                    const unsupportedSpan = document.createElement('span');
                    unsupportedSpan.textContent = ' [Unsupported format]';
                    unsupportedSpan.className = 'text-color-warning file-note';
                    itemDiv.appendChild(unsupportedSpan);
                }
                
                itemDiv.addEventListener('click', () => handleItemClick(item));
                fileTree.appendChild(itemDiv);
            });
    }
}); 