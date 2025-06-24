import React from 'react';
import './UrlInputBox.css';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/SimpleLanguageContext';

const UrlInputBox = ({ onUrlFetched }) => {
  const { t } = useLanguage();


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
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, no-useless-escape */}
          <a 
            href={`javascript:(function(){
              const content=document.body.innerText||document.body.textContent||'';
              const title=document.title||'${t('url.bookmarklet.defaultTitle') || 'Web Content'}';
              const url=window.location.href;
              const result='# '+title+'\\\\n\\\\n**${t('url.bookmarklet.sourceUrl') || 'Source URL'}:** '+url+'\\\\n\\\\n**${t('url.bookmarklet.captureTime') || 'Capture Time'}:** '+(new Date().toLocaleString())+'\\\\n\\\\n---\\\\n\\\\n'+content;
              const newWindow=window.open('','_blank','width=800,height=600');
              if(newWindow){
                const htmlContent='<html><head><title>${t('url.bookmarklet.title') || 'Web Content Extraction'}</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.6}textarea{width:100%;height:400px;font-family:monospace;border:1px solid #ddd;padding:10px}button{background:#007cba;color:white;border:none;padding:10px 20px;cursor:pointer;margin:5px;border-radius:4px}button:hover{background:#005a87}.header{background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px}</style></head><body><div class="header"><h2>✅ ${t('url.bookmarklet.success') || 'Content Extracted Successfully'}</h2><p>${t('url.bookmarklet.instruction') || 'Content has been extracted. Please copy the text below:'}</p></div><textarea id="content">'+result.replace(/'/g,"&#39;")+'</textarea><div style="margin-top:10px;"><button onclick="copyContent()">${t('url.bookmarklet.copyBtn') || '📋 Copy Content'}</button><button onclick="downloadContent()">${t('url.bookmarklet.downloadBtn') || '💾 Download File'}</button><button onclick="window.close()">${t('url.bookmarklet.closeBtn') || '❌ Close Window'}</button></div><script>function copyContent(){const textarea=document.getElementById(\"content\");textarea.select();try{document.execCommand(\"copy\");alert(\"${t('url.bookmarklet.copied') || 'Copied to clipboard!'}\");}catch(e){alert(\"Copy failed, please select and copy manually.\");}}function downloadContent(){try{const content=document.getElementById(\"content\").value;const now=new Date();const timestamp=now.getFullYear()+\"-\"+(now.getMonth()+1).toString().padStart(2,\"0\")+\"-\"+now.getDate().toString().padStart(2,\"0\")+\"_\"+now.getHours().toString().padStart(2,\"0\")+\"-\"+now.getMinutes().toString().padStart(2,\"0\")+\"-\"+now.getSeconds().toString().padStart(2,\"0\");const filename=\"webpage-content_\"+timestamp+\".md\";const blob=new Blob([content],{type:\"text/markdown\"});const url=URL.createObjectURL(blob);const a=document.createElement(\"a\");a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}catch(e){alert(\"Download failed: \"+e.message);}}</script></body></html>';
                newWindow.document.write(htmlContent);
                newWindow.document.close();
              }
            })();`.replace(/\s+/g, ' ').trim()}
            className="bookmarklet-link"
            onClick={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
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
    </div>
  );
};

export default UrlInputBox; 