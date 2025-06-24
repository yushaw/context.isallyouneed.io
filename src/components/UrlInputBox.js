import React, { useState } from 'react';
import './UrlInputBox.css';
import { Globe, ArrowRightCircle, Loader2 } from 'lucide-react';

const UrlInputBox = ({ onUrlFetched }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchUrl = async () => {
    if (url) {
      setIsLoading(true);
      let fetchedTextContent = '';
      
      // Validate and normalize URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.match(/^https?:\/\//)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      // Using a public CORS proxy for broader compatibility. 
      // WARNING: Public proxies have limitations, can be unreliable, and are not suitable for production.
      // For production, a self-hosted CORS proxy or server-side fetching is recommended.
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalizedUrl)}`;

      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          // Try fetching directly if proxy fails or if it's a non-HTTP error from proxy itself
          // This direct fetch will likely fail for many sites due to CORS
          try {
            console.warn(`Proxy fetch failed with status ${response.status}. Trying direct fetch for ${normalizedUrl}...`);
            const directResponse = await fetch(normalizedUrl);
            if (!directResponse.ok) {
                throw new Error(`Direct fetch failed with status: ${directResponse.status}`);
            }
            fetchedTextContent = await directResponse.text();
          } catch (directError) {
            console.error("Direct fetch also failed:", directError);
            throw new Error(`Proxy status: ${response.status}, Direct fetch error: ${directError.message}`);
          }
        }
        // If proxy response was ok, or direct fetch succeeded
        if (!fetchedTextContent) { // if not already set by direct fetch
            fetchedTextContent = await response.text();
        }

        // Basic HTML to text conversion (very rudimentary)
        // A proper library (like DOMPurify for security, then DOMParser) is better for real apps.
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fetchedTextContent; // This could be risky if content isn't sanitized
        let extractedText = tempDiv.textContent || tempDiv.innerText || "";
        
        // Simple cleanup: reduce multiple newlines/spaces
        extractedText = extractedText.replace(/\s\s+/g, ' ').replace(/\n\n+/g, '\n').trim();

        if (extractedText.length > 10000) { // Limit context length
          extractedText = extractedText.substring(0, 10000) + "... [content truncated]";
        }
        onUrlFetched(extractedText, normalizedUrl);
      } catch (error) {
        console.error("Failed to fetch URL:", error);
        onUrlFetched(`Error fetching content from ${normalizedUrl}: ${error.message}`, normalizedUrl);
      }
      setIsLoading(false);
    } else {
      alert("Please enter a URL.");
    }
  };

  return (
    <div className="bento-box url-input-box">
      <div className="box-header">
        <Globe />
        <h2>Website Scraper</h2>
      </div>
      <p className="box-description">Enter a URL to fetch its content (uses a public CORS proxy).</p>
      <div className="url-input-group">
        <input 
          type="url" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
        />
        <button onClick={handleFetchUrl} disabled={isLoading || !url}>
          {isLoading ? <Loader2 className="icon-loading-animate" size={18} /> : <ArrowRightCircle size={18} />}
          {isLoading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>
    </div>
  );
};

export default UrlInputBox; 