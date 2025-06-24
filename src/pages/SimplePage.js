import React, { useState, useCallback } from 'react';
import { FileCode2, Globe, Copy, Download, Trash2, Check, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import JSZip from 'jszip';

// File blacklist patterns
const BLACKLIST_PATTERNS = [
  // Dependencies
  'node_modules/',
  'vendor/',
  'bower_components/',
  '.pnp/',
  '.yarn/',
  
  // Build outputs
  'dist/',
  'build/',
  'out/',
  '.next/',
  '.nuxt/',
  '.cache/',
  'coverage/',
  
  // IDE & OS
  '.idea/',
  '.vscode/',
  '.DS_Store',
  'Thumbs.db',
  
  // Version control
  '.git/',
  '.svn/',
  '.hg/',
  
  // Config files we want to skip
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'Gemfile.lock',
  '.env',
  '.env.local',
  '.env.production',
  
  // Binary and media files
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
  '.mp3', '.mp4', '.avi', '.mov', '.wav',
  '.zip', '.tar', '.gz', '.rar', '.7z',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.exe', '.dll', '.so', '.dylib',
  '.woff', '.woff2', '.ttf', '.otf', '.eot',
  
  // Compiled files
  '.pyc', '.pyo', '.class', '.o', '.obj',
  
  // Logs and temp files
  '.log', '.tmp', '.temp', '.swp', '.swo',
  
  // Test snapshots
  '__snapshots__/',
  '.snap'
];

const SimplePage = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [fileTree, setFileTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [url, setUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [context, setContext] = useState('');
  const [copied, setCopied] = useState(false);

  // Check if file should be blacklisted
  const shouldSkipFile = (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return BLACKLIST_PATTERNS.some(pattern => {
      if (pattern.includes('/')) {
        // Directory pattern
        return normalizedPath.includes(pattern);
      } else if (pattern.startsWith('.')) {
        // Extension pattern
        return normalizedPath.endsWith(pattern);
      } else {
        // Filename pattern
        const filename = normalizedPath.split('/').pop();
        return filename === pattern;
      }
    });
  };

  // Build file tree structure
  const buildFileTree = (files) => {
    const tree = { name: 'root', children: {}, files: [] };
    
    files.forEach(file => {
      const parts = file.path.split('/').filter(p => p);
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current.files.push({ name: part, path: file.path, size: file.size });
        } else {
          // It's a directory
          if (!current.children[part]) {
            current.children[part] = { name: part, children: {}, files: [] };
          }
          current = current.children[part];
        }
      });
    });
    
    return tree;
  };

  // File processing function
  const processFiles = useCallback(async (fileList) => {
    const allFiles = [];
    
    for (const file of fileList) {
      const filePath = file.webkitRelativePath || file.name;
      const isIgnored = shouldSkipFile(filePath);
      
      if (file.name.endsWith('.zip')) {
        // Handle zip files
        const zip = new JSZip();
        try {
          const content = await zip.loadAsync(file);
          const promises = [];
          
          content.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir) {
              const isZipFileIgnored = shouldSkipFile(relativePath);
              if (isTextFile(relativePath)) {
                promises.push(
                  zipEntry.async('string').then(text => ({
                    name: relativePath,
                    path: relativePath,
                    content: text,
                    size: text.length,
                    isIgnored: isZipFileIgnored
                  })).catch(() => ({
                    name: relativePath,
                    path: relativePath,
                    content: '',
                    size: 0,
                    isIgnored: isZipFileIgnored
                  }))
                );
              } else {
                // Non-text file
                allFiles.push({
                  name: relativePath.split('/').pop(),
                  path: relativePath,
                  content: '',
                  size: 0,
                  isIgnored: isZipFileIgnored,
                  isBinary: true
                });
              }
            }
          });
          
          const zipFiles = await Promise.all(promises);
          allFiles.push(...zipFiles);
        } catch (error) {
          console.error('Error processing zip:', error);
        }
      } else if (isTextFile(file.name)) {
        const text = isIgnored ? '' : await readFileAsText(file);
        allFiles.push({
          name: file.name,
          path: filePath,
          content: text,
          size: file.size,
          isIgnored
        });
      } else {
        // Binary or non-text file
        allFiles.push({
          name: file.name,
          path: filePath,
          content: '',
          size: file.size,
          isIgnored,
          isBinary: true
        });
      }
    }
    
    setFiles(prev => {
      const newFiles = [...prev, ...allFiles];
      
      // Auto-select new files that are not ignored and have content
      const newSelected = new Set(selectedFiles);
      allFiles.forEach((file, index) => {
        if (!file.isIgnored && !file.isBinary && file.content) {
          newSelected.add(prev.length + index);
        }
      });
      setSelectedFiles(newSelected);
      
      // Update context with selected files only
      updateContext(newFiles, newSelected);
      
      // Build file tree if we have files with paths
      if (newFiles.some(f => f.path && f.path.includes('/'))) {
        const tree = buildFileTree(newFiles);
        setFileTree(tree);
        
        // Default expand first level
        const firstLevelFolders = new Set();
        Object.keys(tree.children).forEach(folderName => {
          firstLevelFolders.add(folderName);
        });
        setExpandedFolders(firstLevelFolders);
      }
      
      return newFiles;
    });
  }, [selectedFiles]);

  // File handling
  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  }, [processFiles]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const readFileAsText = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve('Error reading file');
      reader.readAsText(file);
    });
  };

  const isTextFile = (fileName) => {
    const textExtensions = ['txt', 'md', 'json', 'js', 'jsx', 'ts', 'tsx', 'css', 'html', 'xml', 'py', 'java', 'c', 'cpp', 'h', 'cs', 'go', 'rb', 'php', 'sh', 'yaml', 'yml'];
    const ext = fileName.split('.').pop()?.toLowerCase();
    return textExtensions.includes(ext) || fileName.includes('README') || fileName.startsWith('.');
  };

  // URL handling
  const handleUrlFetch = async () => {
    if (!url) return;
    
    setIsLoadingUrl(true);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      
      const cleanText = text.replace(/\s\s+/g, ' ').trim().substring(0, 10000);
      
      const urlFile = {
        name: new URL(url).hostname,
        content: cleanText,
        size: cleanText.length,
        isUrl: true
      };
      
      setFiles(prev => {
        const newFiles = [...prev, urlFile];
        
        // Auto-select the new URL file
        const newSelected = new Set(selectedFiles);
        newSelected.add(prev.length);
        setSelectedFiles(newSelected);
        
        updateContext(newFiles, newSelected);
        return newFiles;
      });
      setUrl('');
    } catch (error) {
      alert('Failed to fetch URL. Please try again.');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  // Generate ASCII directory tree
  const generateDirectoryTree = (fileList) => {
    if (!fileList.some(f => f.path && f.path.includes('/'))) return '';
    
    const tree = { name: 'root', children: {}, files: [] };
    
    // Build tree structure
    fileList.forEach(file => {
      if (!file.path || !file.path.includes('/')) return;
      
      const parts = file.path.split('/').filter(p => p);
      let current = tree;
      
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // It's a file
          current.files.push(part);
        } else {
          // It's a directory
          if (!current.children[part]) {
            current.children[part] = { name: part, children: {}, files: [] };
          }
          current = current.children[part];
        }
      });
    });
    
    // Render tree as ASCII
    const renderTree = (node, prefix = '', isLast = true) => {
      let result = '';
      const entries = Object.entries(node.children);
      const allItems = [...entries, ...node.files.map(f => [f, null])];
      
      allItems.forEach(([name, child], index) => {
        const isLastItem = index === allItems.length - 1;
        const connector = isLastItem ? '└── ' : '├── ';
        const isFile = child === null;
        
        result += prefix + connector + name + (isFile ? '' : '/') + '\n';
        
        if (!isFile) {
          const extension = isLastItem ? '    ' : '│   ';
          result += renderTree(child, prefix + extension, isLastItem);
        }
      });
      
      return result;
    };
    
    return '```\n' + renderTree(tree) + '```\n\n';
  };

  // Context handling
  const updateContext = (fileList, selectedSet = selectedFiles) => {
    const selectedFilesList = fileList.filter((_, index) => selectedSet.has(index));
    
    if (selectedFilesList.length === 0) {
      setContext('');
      return;
    }
    
    // Generate directory tree if we have folder structure
    const treeText = generateDirectoryTree(selectedFilesList);
    
    // Generate file contents
    const contextText = selectedFilesList
      .map(file => {
        const fileType = file.isUrl ? 'URL' : 'File';
        let content = '';
        
        if (file.content) {
          content = file.content;
        } else if (file.isBinary) {
          content = '[Binary file - content cannot be read]';
        } else if (file.isIgnored) {
          content = '[File ignored by blacklist - content not loaded]';
        } else {
          content = '[Unable to read file content]';
        }
        
        return `## ${fileType}: ${file.path || file.name}\n\n${content}\n`;
      })
      .join('\n---\n\n');
    
    setContext(treeText + contextText);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    // Update selected files indices
    const newSelected = new Set();
    selectedFiles.forEach(i => {
      if (i < index) newSelected.add(i);
      else if (i > index) newSelected.add(i - 1);
    });
    setSelectedFiles(newSelected);
    
    updateContext(newFiles, newSelected);
    
    // Rebuild file tree if needed
    if (newFiles.some(f => f.path && f.path.includes('/'))) {
      const tree = buildFileTree(newFiles);
      setFileTree(tree);
      
      // Maintain first level expansion
      const firstLevelFolders = new Set();
      Object.keys(tree.children).forEach(folderName => {
        if (expandedFolders.has(folderName)) {
          firstLevelFolders.add(folderName);
        }
      });
      setExpandedFolders(firstLevelFolders);
    } else {
      setFileTree(null);
      setExpandedFolders(new Set());
    }
  };

  const clearAll = () => {
    setFiles([]);
    setSelectedFiles(new Set());
    setFileTree(null);
    setExpandedFolders(new Set());
    setContext('');
    setUrl('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(context);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  const downloadContext = () => {
    const blob = new Blob([context], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'context.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle file selection
  const toggleFileSelection = (index) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedFiles(newSelected);
    updateContext(files, newSelected);
  };

  // Toggle folder expansion
  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  // Render file tree recursively
  const renderFileTree = (node, path = '') => {
    if (!node) return null;
    
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(currentPath);
    
    return (
      <div className="tree-node">
        {/* Render folders */}
        {Object.entries(node.children).map(([name, child]) => {
          const folderPath = path ? `${path}/${name}` : name;
          const isExpanded = expandedFolders.has(folderPath);
          
          return (
            <div key={folderPath} className="tree-folder">
              <div 
                className="tree-item folder-item"
                onClick={() => toggleFolder(folderPath)}
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Folder size={14} />
                <span>{name}</span>
              </div>
              {isExpanded && (
                <div className="tree-children">
                  {renderFileTree(child, folderPath)}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Render files */}
        {node.files.map(file => {
          const fileIndex = files.findIndex(f => f.path === file.path);
          const fileData = files[fileIndex];
          const isSelected = selectedFiles.has(fileIndex);
          const isIgnored = fileData?.isIgnored || false;
          
          return (
            <div key={file.path} className={`tree-item file-item ${isIgnored ? 'ignored' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleFileSelection(fileIndex)}
                className="file-checkbox"
              />
              <FileCode2 size={14} />
              <span>{file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Context Builder</h1>
        <p className="text-secondary">Prepare content for LLM interactions</p>
      </header>

      <main className="main-content">
        {/* Input Section */}
        <div className="card mb-3">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              <FileCode2 size={16} />
              Files
            </button>
            <button 
              className={`tab ${activeTab === 'url' ? 'active' : ''}`}
              onClick={() => setActiveTab('url')}
            >
              <Globe size={16} />
              URL
            </button>
          </div>

          {activeTab === 'files' ? (
            <div 
              className="drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <FileCode2 size={32} className="drop-icon" />
              <p>Drop files here or click to select</p>
              <p className="text-secondary">Supports text files and ZIP archives</p>
              <input
                type="file"
                multiple
                webkitdirectory=""
                directory=""
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" className="file-input-label">
                Select Files or Folder
              </label>
            </div>
          ) : (
            <div className="url-input">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyPress={(e) => e.key === 'Enter' && handleUrlFetch()}
              />
              <button 
                onClick={handleUrlFetch} 
                disabled={!url || isLoadingUrl}
              >
                {isLoadingUrl ? 'Fetching...' : 'Fetch'}
              </button>
            </div>
          )}
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="card mb-3">
            <div className="files-header">
              <h2>Sources ({files.length})</h2>
              <button className="secondary" onClick={clearAll}>
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
            
            {/* Show file tree if available, otherwise show flat list */}
            {fileTree && fileTree.children && Object.keys(fileTree.children).length > 0 ? (
              <div className="file-tree">
                {renderFileTree(fileTree)}
              </div>
            ) : (
              <div className="files-list">
                {files.map((file, index) => (
                  <div key={index} className={`file-item ${file.isIgnored ? 'ignored' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(index)}
                      onChange={() => toggleFileSelection(index)}
                      className="file-checkbox"
                    />
                    <span className="file-name">
                      {file.isUrl ? <Globe size={14} /> : <FileCode2 size={14} />}
                      {file.path || file.name}
                    </span>
                    <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                    <button 
                      className="icon-button"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Context Output */}
        {context && (
          <div className="card">
            <div className="context-header">
              <h2>Generated Context</h2>
              <div className="context-actions">
                <button onClick={copyToClipboard}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="secondary" onClick={downloadContext}>
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={context}
              readOnly
              className="context-output"
              placeholder="Your generated context will appear here..."
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default SimplePage;