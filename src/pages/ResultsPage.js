import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultsPage.css'; // Create this CSS file later

const ResultsPage = () => {
  const [generatedContext, setGeneratedContext] = useState('');
  const [fileStructure, setFileStructure] = useState([]); // Array of { name, path, content, size, type }
  const [selectedFilePaths, setSelectedFilePaths] = useState({}); // Map of path -> boolean
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dataKeyFromQuery = queryParams.get('dataKey');
    const dataKeyFromState = location.state?.dataKey;
    const dataKey = dataKeyFromQuery || dataKeyFromState;

    if (dataKey) {
      const storedData = sessionStorage.getItem(dataKey);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          let initialContext = '';
          const initialSelectedPaths = {};

          if (parsedData.type === 'url') {
            initialContext = `## Content from URL: ${parsedData.url}\n\n${parsedData.content}`;
            setFileStructure([]);
            setSelectedFilePaths({});
          } else if (Array.isArray(parsedData)) {
            const validFiles = parsedData.filter(f => f && f.path && f.content);
            validFiles.forEach(file => {
              initialContext += `## Content from File: ${file.path}\n\n${file.content}\n\n`;
              initialSelectedPaths[file.path] = true; // Select all valid files by default
            });
            setFileStructure(validFiles);
            setSelectedFilePaths(initialSelectedPaths);
          }
          setGeneratedContext(initialContext);
          // sessionStorage.removeItem(dataKey); // Consider removing the key after use
        } catch (error) {
          console.error("Error parsing data from sessionStorage:", error);
          setGeneratedContext("Error: Could not load context data.");
        }
      } else {
        setGeneratedContext(`No context data found for key: ${dataKey}. It might have expired or been cleared.`);
      }
    } else {
      setGeneratedContext("No data key provided to load context.");
    }
  }, [location]); // Only re-run when location changes

  // Effect to update generatedContext when selectedFilePaths or fileStructure changes
  useEffect(() => {
    if (fileStructure.length === 0 && generatedContext.startsWith("## Content from URL")) {
        // This is a URL, context is already set and won't change based on file selections
        return;
    }
    
    let newContext = '';
    fileStructure.forEach(file => {
      if (selectedFilePaths[file.path] && file.content) {
        newContext += `## Content from File: ${file.path}\n\n${file.content}\n\n`;
      }
    });
    setGeneratedContext(newContext);
  }, [selectedFilePaths, fileStructure]);

  const handleCopyContext = () => {
    if (generatedContext) {
      navigator.clipboard.writeText(generatedContext)
        .then(() => alert("Context copied to clipboard!"))
        .catch(err => console.error('Failed to copy: ', err));
    } else {
      alert("Nothing to copy.");
    }
  };

  const toggleFileSelection = (filePath) => {
    setSelectedFilePaths(prev => ({
      ...prev,
      [filePath]: !prev[filePath]
    }));
  };
  
  // Simple helper to get depth for indentation (basic version)
  const getPathDepth = (filePath) => {
    return filePath.split('/').length -1;
  };

  // Simple helper to get base name
  const getBasename = (filePath) => {
    return filePath.split('/').pop() || filePath;
  }

  return (
    <div className="results-page-container">
      {fileStructure.length > 0 && (
        <aside className="file-tree-panel">
          <h3>Files Processed</h3>
          {/* TODO: Implement a proper tree view component for better hierarchy */}
          <ul>
            {fileStructure.map(file => (
              <li 
                key={file.path} 
                className="file-tree-item"
                style={{ marginLeft: `${getPathDepth(file.path) * 15}px` }} // Basic indentation
              >
                <label title={file.path}>
                  <input 
                    type="checkbox" 
                    checked={selectedFilePaths[file.path] || false} 
                    onChange={() => toggleFileSelection(file.path)} 
                  />
                  {getBasename(file.path)}
                </label>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <main className={`main-content-panel ${fileStructure.length > 0 ? 'with-sidebar' : 'full-width'}`}>
        <header className="results-header">
          <h1>Generated Context</h1>
          <button onClick={handleCopyContext} disabled={!generatedContext || generatedContext.startsWith("Error:") || generatedContext.startsWith("No context")}>
            Copy Selected Context
          </button>
        </header>
        <pre className="results-content">
          {generatedContext || (fileStructure.length > 0 ? "Select files to build context." : "Loading context or no files processed...")}
        </pre>
      </main>
    </div>
  );
};

export default ResultsPage; 