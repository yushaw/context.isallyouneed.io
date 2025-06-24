import React, { useState, useCallback } from 'react';
import './CodeInputBox.css';
import { FileCode2, UploadCloud, FilePlus, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';
import JSZip from 'jszip';

const IGNORE_PATTERNS = [
  // General version control
  '/.git/',
  '/.svn/',
  '/.hg/',
  // Node.js
  '/node_modules/',
  'package-lock.json',
  'yarn.lock',
  // Python
  '/__pycache__/',
  '.Python',
  '/build/',
  '/develop-eggs/',
  '/dist/',
  '/downloads/',
  '/eggs/',
  '/.eggs/',
  '/lib/',
  '/lib64/',
  '/parts/',
  '/sdist/',
  '/var/',
  '/wheels/',
  'pip-wheel-metadata/',
  'share/python-wheels/',
  '/.env',
  '/.venv/',
  'env/',
  'venv/',
  'ENV/',
  'VENV/',
  '*.pyc',
  '*.pyo',
  '*.pyd',
  // Java / Maven / Gradle
  '/target/',
  '/.gradle/',
  'build/', // Can be generic, but often Java/Android
  '*.class',
  '*.jar',
  '*.war',
  '*.ear',
  // OS specific
  '.DS_Store',
  'Thumbs.db',
  // IDE / Editor specific
  '/.idea/',
  '/.vscode/',
  '*.sublime-project',
  '*.sublime-workspace',
  // Compiled outputs / logs
  '*.log',
  '*.tmp',
  '*.temp',
  // Common binary file extensions (add more as needed)
  '*.png', '*.jpg', '*.jpeg', '*.gif', '*.bmp', '*.tiff', '*.ico',
  '*.pdf',
  '*.doc', '*.docx',
  '*.xls', '*.xlsx',
  '*.ppt', '*.pptx',
  '*.exe', '*.dll', '*.so', '*.dylib',
  '*.zip', // We process zips, but ignore zips *within* zips unless explicitly handled
  '*.tar', '*.gz', '*.rar', '*.7z',
  '*.mp3', '*.wav', '*.ogg',
  '*.mp4', '*.mov', '*.avi', '*.webm',
  '*.woff', '*.woff2', '*.ttf', '*.otf', '*.eot',
  '*.svg', // Often text-based but can be very large and not useful for LLM context
];

// Helper function to check if a path should be ignored
const shouldIgnore = (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize to forward slashes
  return IGNORE_PATTERNS.some(pattern => {
    if (pattern.startsWith('/') && pattern.endsWith('/')) { // Folder pattern like /node_modules/
      return normalizedPath.includes(pattern.slice(1, -1)); // Check if path segment exists
    } else if (pattern.startsWith('*')) { // Wildcard extension like *.pyc
      return normalizedPath.endsWith(pattern.slice(1));
    } else { // Exact file name or full path segment
      return normalizedPath.endsWith(pattern) || normalizedPath.includes(`/${pattern}/`);
    }
  });
};

const CodeInputBox = ({ onFilesProcessed, key: resetKey }) => {
  const { t } = useLanguage();
  const [selectedFilesDisplay, setSelectedFilesDisplay] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Effect to clear files when resetKey changes (i.e., context is cleared in App)
  React.useEffect(() => {
    setSelectedFilesDisplay([]);
  }, [resetKey]);

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Use webkitRelativePath if available, otherwise just file.name
      const path = file.webkitRelativePath || file.name;
      reader.onload = (e) => resolve({ name: file.name, path: path, content: e.target.result, size: file.size, type: file.type, isTextFile: true });
      reader.onerror = (e) => {
        console.error("Error reading file:", file.name, e);
        resolve({ name: file.name, path: path, content: `Error reading file: ${file.name}`, size: file.size, type: file.type, isTextFile: true });
      };
      reader.readAsText(file);
    });
  };

  const isTextFile = (fileName, fileType) => {
    if (shouldIgnore(fileName)) return false; // Check against ignore list first
    const textExtensions = ['txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rb', 'php', 'sh', 'yaml', 'yml', 'ini', 'cfg', 'log', 'sql', 'r', 'swift', 'kt', 'kts', 'gradle', 'conf', 'bat', 'ps1', 'pl', 'feature', 'rst', 'tex', 'bib', 'diff', 'patch', 'csv', 'tsv', 'env', 'lock', 'toml', 'sum', 'Dockerfile', 'Makefile', '.gitignore', '.gitattributes'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return (fileType && fileType.startsWith('text/')) || (extension && textExtensions.includes(extension)) || fileName.includes('config') || fileName.includes('rc') || fileName.startsWith('.'); // Include common config like .bashrc, .npmrc, etc.
  };

  const processAndDisplayFiles = useCallback(async (fileList) => {
    if (fileList.length === 0) return;

    // Track file upload event
    if (window.gtag) {
      window.gtag('event', 'file_upload', {
        event_category: 'engagement',
        event_label: 'files_uploaded',
        value: fileList.length
      });
    }

    // Set loading state immediately to avoid UI blocking
    setIsProcessing(true);
    
    // Use setTimeout to ensure UI updates before heavy processing
    setTimeout(async () => {
      let newDisplayFiles = []; // For the main page file list display
      let filesToProcessPromises = [];

    for (const file of fileList) {
      // Use webkitRelativePath for display name if available, provides full path for folders
      const displayName = file.webkitRelativePath || file.name;
      newDisplayFiles.push({ name: displayName, size: file.size, type: file.type });

      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        try {
          const content = await zip.loadAsync(file);
          const zipFilePromises = [];
          content.forEach((relativePath, zipEntry) => {
            // Process all files (including ignored ones for display)
            if (!zipEntry.dir) {
              const isIgnored = shouldIgnore(zipEntry.name);
              if (isTextFile(zipEntry.name, null) && !isIgnored) {
                // For text files that are not ignored, read the content
                zipFilePromises.push(
                  zipEntry.async('string').then(textContent => ({
                    name: zipEntry.name,
                    path: zipEntry.name,
                    content: textContent,
                    size: textContent.length, 
                    type: 'text/plain',
                    isTextFile: true,
                    isIgnored: false
                  }))
                  .catch(err => {
                      console.error("Error reading file from zip:", zipEntry.name, err);
                      return { name: zipEntry.name, path: zipEntry.name, content: `Error reading file from zip: ${zipEntry.name}`, size: 0, type: 'error', isTextFile: true, isIgnored: false };
                  })
                );
              } else {
                // For non-text files or ignored files, just add metadata
                zipFilePromises.push(Promise.resolve({
                  name: zipEntry.name,
                  path: zipEntry.name,
                  content: isIgnored ? '[File ignored by filters]' : '[Binary file - content cannot be read]',
                  size: 0, // We don't have easy access to original size
                  type: 'binary',
                  isTextFile: false,
                  isIgnored: isIgnored
                }));
              }
            }
          });
          const processedZipFiles = await Promise.all(zipFilePromises);
          filesToProcessPromises.push(...processedZipFiles.map(f => Promise.resolve(f))); // re-wrap as promises if needed or just add

        } catch (error) {
          console.error("Error processing ZIP file:", file.name, error);
          filesToProcessPromises.push(Promise.resolve({ name: file.name, path: file.name, content: `Error processing ZIP: ${error.message}`, size: file.size, type: file.type }));
        }
      } else {
        const path = file.webkitRelativePath || file.name;
        if (isTextFile(file.name, file.type)) {
          // For text files, read the content
          filesToProcessPromises.push(readFileAsText(file));
        } else {
          // For non-text files, just add metadata with ignored status
          const isIgnored = shouldIgnore(path);
          filesToProcessPromises.push(Promise.resolve({
            name: file.name,
            path: path,
            content: isIgnored ? '[File ignored by filters]' : '[Binary file - content cannot be read]',
            size: file.size,
            type: file.type || 'binary',
            isTextFile: false,
            isIgnored: isIgnored
          }));
        }
      }
    }
    
    Promise.all(filesToProcessPromises).then(filesWithContent => {
        onFilesProcessed(filesWithContent.filter(f => f && f.content)); 
        setIsProcessing(false);
    }).catch(error => {
        console.error('Error processing files:', error);
        setIsProcessing(false);
    });

      setSelectedFilesDisplay(prevFiles => [...prevFiles, ...newDisplayFiles]);
    }, 10); // Small delay to ensure UI updates

  }, [onFilesProcessed]);

  const handleFileChange = (event) => {
    processAndDisplayFiles(event.target.files);
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    processAndDisplayFiles(event.dataTransfer.files);
  }, [processAndDisplayFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  return (
    <div className="bento-box code-input-box">
      <div className="box-header">
        <FileCode2 />
        <h2>{t('files.upload.processor.title')}</h2>
      </div>
      <p className="box-description">
        {t('files.upload.processor.description')}
        <br />
        🔒 <strong>{t('files.upload.privacy.note')}</strong>{t('files.upload.privacy.description')}
      </p>
      <div 
        className={`file-drop-area ${isDragOver ? 'dragover' : ''} ${isProcessing ? 'processing' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isProcessing ? (
          <>
            <Loader2 size={48} className="upload-icon loading-animate" />
            <p>{t('files.upload.loading')}</p>
            <p className="or-text">{t('files.upload.processing')}</p>
          </>
        ) : (
          <>
            <UploadCloud size={48} className="upload-icon" />
            <p>{t('files.upload.description')}</p>
            <p className="or-text">or</p>
            <label htmlFor="file-upload-input" className="custom-file-upload">
              <FilePlus size={18} /> {t('files.upload.browse')}
            </label>
          </>
        )}
        <input 
          type="file" 
          id="file-upload-input" 
          multiple 
          webkitdirectory="true"
          directory="true"
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          onClick={(event)=> { event.target.value = null }}
          disabled={isProcessing}
        />
      </div>
      {selectedFilesDisplay.length > 0 && (
        <div className="file-list-preview">
          <h4>{t('files.sources.title')}:</h4>
          <ul>
            {selectedFilesDisplay.map((file, index) => (
              <li key={index}>
                {file.name} {/* Display name here is webkitRelativePath or file.name */}
                ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeInputBox; 