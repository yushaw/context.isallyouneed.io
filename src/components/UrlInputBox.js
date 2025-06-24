import React, { useState } from 'react';
import './UrlInputBox.css';
import { Globe, ArrowRightCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const UrlInputBox = ({ onUrlFetched }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  // Better URL validation
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Enhanced HTML to text conversion
  const htmlToText = (html) => {
    // Create a new DOMParser for safer HTML parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, noscript');
    scripts.forEach(el => el.remove());
    
    // Get text content
    let text = doc.body ? doc.body.textContent || doc.body.innerText || '' : '';
    
    // Clean up whitespace and formatting
    text = text
      .replace(/\s+/g, ' ')           // Replace multiple spaces/tabs with single space
      .replace(/\n\s*\n/g, '\n')      // Replace multiple newlines with single newline
      .replace(/^\s+|\s+$/gm, '')     // Trim leading/trailing whitespace from lines
      .trim();
    
    return text;
  };

  // Detect content type and handle accordingly
  const processContent = (content, contentType, url) => {
    // Handle different content types
    if (contentType && contentType.includes('application/json')) {
      try {
        const jsonData = JSON.parse(content);
        return `JSON content from ${url}:\n\n${JSON.stringify(jsonData, null, 2)}`;
      } catch (e) {
        return `Invalid JSON content from ${url}:\n\n${content}`;
      }
    } else if (contentType && (contentType.includes('text/plain') || contentType.includes('text/markdown'))) {
      return content;
    } else if (contentType && contentType.includes('text/html')) {
      return htmlToText(content);
    } else {
      // Default to HTML parsing for unknown types
      return htmlToText(content);
    }
  };

  const handleFetchUrl = async () => {
    if (!url.trim()) {
      alert(t('input.url.required'));
      return;
    }

    setIsLoading(true);
    
    // Enhanced URL validation and normalization
    let normalizedUrl = url.trim();
    
    // Add protocol if missing
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Validate URL format
    if (!isValidUrl(normalizedUrl)) {
      alert(t('input.url.invalid'));
      setIsLoading(false);
      return;
    }

    try {
      // Track URL fetch attempt
      if (window.gtag) {
        window.gtag('event', 'url_fetch_attempt', {
          event_category: 'engagement',
          event_label: 'url_fetch'
        });
      }
      
      // 尝试直接获取URL（仅限同源或支持CORS的网站）
      const response = await fetch(normalizedUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      const fetchedContent = await response.text();
      
      // Process the content based on type
      const processedText = processContent(fetchedContent, contentType, normalizedUrl);
      
      // Limit content length for performance
      const maxLength = 20000;
      const finalContent = processedText.length > maxLength 
        ? processedText.substring(0, maxLength) + `\n\n... [${t('content.truncated', {reason: t('content.truncated.length')})}]`
        : processedText;

      // Track successful URL fetch
      if (window.gtag) {
        window.gtag('event', 'url_fetch_success', {
          event_category: 'engagement',
          event_label: 'url_fetch_success'
        });
      }
      
      onUrlFetched(finalContent, normalizedUrl);
      
    } catch (error) {
      console.error("Failed to fetch URL:", error);
      
      // 提供更友好的错误信息和建议
      let errorMessage = '';
      
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        errorMessage += `${t('error.fetch.failed')}\n\n`;
        errorMessage += `${t('error.fetch.cors', { hostname: new URL(normalizedUrl).hostname })}\n\n`;
        errorMessage += `${t('error.fetch.solutions')}\n\n`;
        errorMessage += `${t('error.method.copy')}\n`;
        errorMessage += `${t('error.method.copy.step1')}\n`;
        errorMessage += `${t('error.method.copy.step2')}\n`;
        errorMessage += `${t('error.method.copy.step3')}\n`;
        errorMessage += `${t('error.method.copy.step4')}\n\n`;
        errorMessage += `${t('error.method.save')}\n`;
        errorMessage += `${t('error.method.save.step1')}\n`;
        errorMessage += `${t('error.method.save.step2')}\n\n`;
        errorMessage += `${t('error.method.devtools')}\n`;
        errorMessage += `${t('error.method.devtools.step1')}\n`;
        errorMessage += `${t('error.method.devtools.step2')}\n`;
        errorMessage += `${t('error.method.devtools.step3')}\n\n`;
        errorMessage += `${t('error.cors.tip')}`;
      } else if (error.message.includes('NetworkError') || error.message.includes('ERR_NETWORK')) {
        errorMessage += `${t('error.network.title')}\n\n`;
        errorMessage += `❌ ${t('error.general.message', { error: error.message })}\n\n`;
        errorMessage += `${t('error.network.check')}\n`;
        errorMessage += `${t('error.network.connection')}\n`;
        errorMessage += `${t('error.network.url')}\n`;
        errorMessage += `${t('error.network.vpn')}\n\n`;
        errorMessage += `${t('error.network.suggestion')}`;
      } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        errorMessage += `${t('error.404.title')}\n\n`;
        errorMessage += `${t('error.404.message')}\n\n`;
        errorMessage += `${t('error.404.check')}\n`;
        errorMessage += `${t('error.404.url.complete')}\n`;
        errorMessage += `${t('error.404.moved')}\n`;
        errorMessage += `${t('error.404.login')}`;
      } else {
        errorMessage += `${t('error.general.title')}\n\n`;
        errorMessage += `${t('error.general.message', { error: error.message })}\n\n`;
        errorMessage += `${t('error.general.reasons')}\n`;
        errorMessage += `${t('error.general.server')}\n`;
        errorMessage += `${t('error.general.format')}\n`;
        errorMessage += `${t('error.general.permission')}\n`;
        errorMessage += `${t('error.general.blocked')}\n\n`;
        errorMessage += `${t('error.general.suggestion')}`;
      }
      
      onUrlFetched(errorMessage, normalizedUrl);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="bento-box url-input-box">
      <div className="box-header">
        <Globe />
        <h2>{t('url.title')}</h2>
      </div>
      <p className="box-description">
        📌 <strong>{t('url.description.note')}</strong>{t('url.description.cors')}
        <br />
        💡 <strong>{t('url.description.suggestion')}</strong>{t('url.description.recommend')}
      </p>
      
      {/* 书签工具说明 */}
      <div className="bookmarklet-section">
        <h3>🔖 {t('url.bookmarklet.title')}</h3>
        <p>{t('url.bookmarklet.description')}</p>
        <div className="bookmarklet-container">
          <a 
            href={`javascript:(function(){
              const content=document.body.innerText||document.body.textContent||'';
              const title=document.title||'${t('url.bookmarklet.defaultTitle') || 'Web Content'}';
              const url=window.location.href;
              const result='# '+title+'\\n\\n**${t('url.bookmarklet.sourceUrl') || 'Source URL'}:** '+url+'\\n\\n**${t('url.bookmarklet.captureTime') || 'Capture Time'}:** '+(new Date().toLocaleString())+'\\n\\n---\\n\\n'+content;
              const newWindow=window.open('','_blank','width=800,height=600');
              if(newWindow){
                newWindow.document.write('<html><head><title>${t('url.bookmarklet.title') || 'Web Content Extraction'}</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.6}textarea{width:100%;height:400px;font-family:monospace;border:1px solid #ddd;padding:10px}button{background:#007cba;color:white;border:none;padding:10px 20px;cursor:pointer;margin:5px;border-radius:4px}button:hover{background:#005a87}.header{background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px}</style></head><body><div class="header"><h2>✅ ${t('url.bookmarklet.success') || 'Content Extracted Successfully'}</h2><p>${t('url.bookmarklet.instruction') || 'Content has been extracted. Please copy the text below:'}</p></div><textarea id="content">'+result.replace(/'/g,"&#39;")+'</textarea><div style="margin-top:10px;"><button onclick="document.getElementById(\\'content\\').select();document.execCommand(\\'copy\\');alert(\\'${t('url.bookmarklet.copied') || 'Copied to clipboard!'}\\')">${t('url.bookmarklet.copyBtn') || '📋 Copy Content'}</button><button onclick="const blob=new Blob([document.getElementById(\\'content\\').value],{type:\\'text/markdown\\'});const url=URL.createObjectURL(blob);const a=document.createElement(\\'a\\');a.href=url;a.download=\\'webpage-content.md\\';a.click();URL.revokeObjectURL(url)">${t('url.bookmarklet.downloadBtn') || '💾 Download File'}</button><button onclick="window.close()">${t('url.bookmarklet.closeBtn') || '❌ Close Window'}</button></div></body></html>');
              }
            })();`.replace(/\s+/g, ' ').trim()}
            className="bookmarklet-link"
            onClick={(e) => e.preventDefault()}
          >
            📚 {t('url.bookmarklet.link')}
          </a>
        </div>
        <div className="bookmarklet-instructions">
          <h4>📋 {t('url.bookmarklet.instructions')}</h4>
          <ol>
            <li>{t('url.bookmarklet.step1')}</li>
            <li>{t('url.bookmarklet.step2')}</li>
            <li>{t('url.bookmarklet.step3')}</li>
            <li>{t('url.bookmarklet.step4')}</li>
            <li>{t('url.bookmarklet.step5')}</li>
          </ol>
        </div>
      </div>
      <div className="url-input-group">
        <input 
          type="url" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('url.input.placeholder')}
          disabled={isLoading}
        />
        <button onClick={handleFetchUrl} disabled={isLoading || !url}>
          {isLoading ? <Loader2 className="icon-loading-animate" size={18} /> : <ArrowRightCircle size={18} />}
          {isLoading ? t('url.fetch.loading') : t('url.fetch.button')}
        </button>
      </div>
    </div>
  );
};

export default UrlInputBox; 