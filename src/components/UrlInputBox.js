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
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, no-useless-escape, no-script-url */}
          <a 
            href={`javascript:(function(){try{function scoreContent(el){var text=el.textContent||'';if(text.length<50)return 0;var words=text.split(/\\s+/).length;var paras=el.querySelectorAll('p').length;var links=el.querySelectorAll('a').length;var linkDensity=links/Math.max(words/20,1);var hasNav=el.closest('nav')||el.classList.contains('nav')||el.classList.contains('navigation')||el.classList.contains('sidebar')||el.classList.contains('menu');var hasAd=el.classList.contains('ad')||el.classList.contains('ads')||el.classList.contains('advertisement')||el.id.includes('ad');var score=words+(paras*5);if(linkDensity>0.5)score*=0.3;if(hasNav||hasAd)score*=0.1;if(el.tagName==='ARTICLE'||el.classList.contains('content')||el.classList.contains('main-content')||el.classList.contains('post-content'))score*=2;return score;}var candidates=Array.from(document.querySelectorAll('article,main,.content,.post-content,.entry-content,section,.main,.article-body,#content,.post,.story-body'));if(!candidates.length){candidates=Array.from(document.querySelectorAll('div')).filter(el=>el.textContent&&el.textContent.length>100);}var best=null;var bestScore=0;for(var el of candidates){var score=scoreContent(el);if(score>bestScore){bestScore=score;best=el;}}if(!best&&document.body.textContent.length>100)best=document.body;if(!best){alert('No content found');return;}var title=document.title||'Web Content';var content=best.textContent||best.innerText||'';content=content.replace(/\\s+/g,' ').trim();var result='# '+title+'\\n\\nSource: '+location.href+'\\n\\n'+content;var win=window.open('','_blank','width=900,height=700');if(win){var fileName=title.replace(/[^a-zA-Z0-9\\s]/g,'').replace(/\\s+/g,'-').substring(0,50)+'.md';win.document.write('<html><head><title>Content Extracted</title><style>body{font-family:Arial,sans-serif;margin:20px;line-height:1.6}.header{background:#f5f5f5;padding:15px;border-radius:5px;margin-bottom:20px}textarea{width:100%;height:500px;border:1px solid #ddd;padding:15px;font-family:Consolas,Monaco,monospace;font-size:13px;border-radius:5px}.actions{margin-top:15px;text-align:center}.btn{background:#007cba;color:white;border:none;padding:10px 20px;margin:0 5px;border-radius:4px;cursor:pointer;font-size:14px}.btn:hover{background:#005a87}.btn-secondary{background:#6c757d}.btn-secondary:hover{background:#545b62}</style></head><body><div class=\"header\"><h2>📚 Content Extraction for AI Context</h2></div><textarea id=\"content\">'+result.replace(/'/g,\"&apos;\")+\"</textarea><div class=\\\"actions\\\"><button class=\\\"btn\\\" onclick=\\\"var t=document.getElementById('content');t.select();document.execCommand('copy');alert('Content copied to clipboard!');\\\">📋 Copy Content</button><button class=\\\"btn btn-secondary\\\" onclick=\\\"var content=document.getElementById('content').value;var blob=new Blob([content],{type:'text/markdown'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='\"+fileName+\"';a.click();URL.revokeObjectURL(url);alert('File downloaded!');\\\">💾 Download File</button><button class=\\\"btn btn-secondary\\\" onclick=\\\"window.close();\\\">❌ Close</button></div></body></html>\");win.document.close();}}catch(e){alert('Extraction Error: '+e.message);}})()`}
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