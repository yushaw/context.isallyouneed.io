import React, { useState, useCallback } from 'react';
import '../index.css';
import Header from '../components/Header';
import CodeInputBox from '../components/CodeInputBox';
import ContextOutputBox from '../components/ContextOutputBox';
import Footer from '../components/Footer';
import { Trash2, FileText, Folder, ChevronRight, ChevronDown, FileCode2, File } from 'lucide-react';

const FilesPage = () => {
  const [contextText, setContextText] = useState('');
  const [processedFiles, setProcessedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [fileTree, setFileTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Determine if a file should be auto-selected
  const shouldAutoSelect = useCallback((filePath) => {
    const normalizedPath = filePath.toLowerCase();
    
    // Library/dependency paths to exclude
    const excludePaths = [
      'node_modules/',
      'vendor/',
      'bower_components/',
      '.yarn/',
      '.pnp/',
      '__pycache__/',
      'venv/',
      'env/',
      '.venv/',
      '.env/',
      'target/',
      'build/',
      'dist/',
      'out/',
      '.next/',
      '.nuxt/',
      'coverage/',
      '.cache/',
      '.git/',
      '.svn/',
      '.hg/',
      '.idea/',
      '.vscode/'
    ];
    
    // Config files to exclude
    const excludeFiles = [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'composer.lock',
      'gemfile.lock',
      'pipfile.lock',
      'poetry.lock',
      '.gitignore',
      '.gitattributes',
      '.dockerignore',
      '.eslintrc',
      '.prettierrc',
      '.babelrc',
      'tsconfig.json',
      'jsconfig.json',
      'webpack.config.js',
      'rollup.config.js',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'dockerfile',
      'docker-compose.yml',
      'docker-compose.yaml'
    ];
    
    // Check if path contains excluded directories
    if (excludePaths.some(path => normalizedPath.includes(path))) {
      return false;
    }
    
    // Check if filename is in exclude list
    const fileName = normalizedPath.split('/').pop();
    if (excludeFiles.includes(fileName)) {
      return false;
    }
    
    // Check for common config file patterns
    if (fileName.startsWith('.') && 
        (fileName.includes('rc') || fileName.includes('config') || fileName.includes('ignore'))) {
      return false;
    }
    
    return true;
  }, []);

  // Build file tree structure for UI
  const buildFileTree = useCallback((files) => {
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
  }, []);

  // Generate ASCII directory tree
  const generateDirectoryTree = useCallback((fileList) => {
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
  }, []);

  const updateContext = useCallback((files, selectedSet) => {
    const selectedFilesList = files.filter((_, index) => selectedSet.has(index));
    
    if (selectedFilesList.length === 0) {
      setContextText('');
      return;
    }
    
    // Generate directory tree if we have folder structure
    const treeText = generateDirectoryTree(selectedFilesList);
    
    // Generate file contents
    let generatedContext = treeText;
    selectedFilesList.forEach(file => {
      if (file && file.path && file.content) {
        if (file.isTextFile === false) {
          // For binary/non-text files
          generatedContext += `## Content from File: ${file.path}\n\n[Binary file - content cannot be read]\n\n`;
        } else {
          // For text files
          generatedContext += `## Content from File: ${file.path}\n\n${file.content}\n\n`;
        }
      }
    });
    setContextText(generatedContext);
  }, [generateDirectoryTree]);

  const handleFilesDataProcessed = useCallback((fileContents) => {
    if (fileContents && fileContents.length > 0) {
      const newFiles = [...processedFiles, ...fileContents];
      const newSelected = new Set(selectedFiles);
      
      // Auto-select newly added text files only (excluding libraries, config files, and ignored files)
      fileContents.forEach((file, index) => {
        if (file.isTextFile !== false && shouldAutoSelect(file.path || file.name) && !file.isIgnored) {
          newSelected.add(processedFiles.length + index);
        }
      });
      
      setProcessedFiles(newFiles);
      setSelectedFiles(newSelected);
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
      } else {
        setFileTree(null);
        setExpandedFolders(new Set());
      }
    }
  }, [processedFiles, selectedFiles, updateContext, buildFileTree, shouldAutoSelect]);

  const handleFileToggle = useCallback((index) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedFiles(newSelected);
    updateContext(processedFiles, newSelected);
  }, [selectedFiles, processedFiles, updateContext]);


  const handleClearAll = useCallback(() => {
    setContextText('');
    setProcessedFiles([]);
    setSelectedFiles(new Set());
    setFileTree(null);
    setExpandedFolders(new Set());
  }, []);

  // Toggle folder expansion
  const toggleFolder = useCallback((path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  }, [expandedFolders]);

  // Render file tree recursively
  const renderFileTree = useCallback((node, path = '') => {
    if (!node) return null;
    
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
          const fileIndex = processedFiles.findIndex(f => f.path === file.path);
          const fileData = processedFiles[fileIndex];
          const isSelected = fileIndex >= 0 && selectedFiles.has(fileIndex);
          const isTextFile = fileData?.isTextFile !== false;
          const wouldAutoSelect = shouldAutoSelect(file.path);
          const isIgnored = fileData?.isIgnored;
          
          // Skip rendering if file not found in processedFiles
          if (fileIndex === -1) {
            return null;
          }
          
          return (
            <div key={file.path} className={`tree-item file-item ${!isTextFile ? 'binary-file' : ''} ${!wouldAutoSelect && isTextFile ? 'config-file' : ''} ${isIgnored ? 'ignored-file' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleFileToggle(fileIndex)}
                className="file-checkbox"
              />
              {isTextFile ? <FileCode2 size={14} /> : <File size={14} />}
              <span>{file.name}</span>
              {!isTextFile && <span className="file-type-label">Binary</span>}
              {!wouldAutoSelect && isTextFile && <span className="file-type-label config">Config</span>}
              {isIgnored && <span className="file-type-label ignored">Ignored</span>}
              <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          );
        })}
      </div>
    );
  }, [processedFiles, selectedFiles, expandedFolders, handleFileToggle, toggleFolder, shouldAutoSelect]);

  return (
    <div className="container">
      <Header />
      <main className="main-content-single">
        <CodeInputBox 
          onFilesProcessed={handleFilesDataProcessed} 
          key={processedFiles.length > 0 ? 'has-files' : 'no-files'} 
        />
        
        {/* Sources section */}
        {processedFiles.length > 0 && (
          <div className="bento-box sources-box">
            <div className="box-header">
              <FileText />
              <h2>Sources ({processedFiles.length})</h2>
              <button className="clear-all-btn" onClick={handleClearAll}>
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
              <div className="sources-list">
                {processedFiles.map((file, index) => {
                  const isTextFile = file.isTextFile !== false;
                  const wouldAutoSelect = shouldAutoSelect(file.path || file.name);
                  const isIgnored = file.isIgnored;
                  return (
                    <div key={index} className={`source-item ${!isTextFile ? 'binary-file' : ''} ${!wouldAutoSelect && isTextFile ? 'config-file' : ''} ${isIgnored ? 'ignored-file' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(index)}
                        onChange={() => handleFileToggle(index)}
                        className="source-checkbox"
                      />
                      {isTextFile ? <FileCode2 size={14} /> : <File size={14} />}
                      <span className="source-name">{file.path || file.name}</span>
                      {!isTextFile && <span className="file-type-label">Binary</span>}
                      {!wouldAutoSelect && isTextFile && <span className="file-type-label config">Config</span>}
                      {isIgnored && <span className="file-type-label ignored">Ignored</span>}
                      <span className="source-size">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Context Output - only show when there are selected files */}
        {selectedFiles.size > 0 && (
          <ContextOutputBox 
            contextText={contextText}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FilesPage;