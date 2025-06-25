import React, { createContext, useContext, useState, useEffect } from 'react';

// 直接定义translations，避免导入问题
const translations = {
  en: {
    files: "Files",
    url: "URL",
    "files.title": "Code Context Builder",
    "files.description": "Upload files or folders to generate context for AI analysis",
    "files.upload.title": "File Upload",
    "files.upload.description": "Drag and drop files/folders here, or click to browse",
    "files.upload.browse": "Browse Files",
    "files.upload.loading": "Processing files...",
    "files.sources.title": "Sources",
    "files.sources.empty": "No files uploaded yet",
    "files.context.title": "Generated Context",
    "files.context.placeholder": "Processed context will appear here...",
    "files.context.copy": "Copy Context",
    "files.context.download": "Download",
    "files.context.copied": "Context copied to clipboard!",
    "files.context.copy.failed": "Failed to copy context. See console for details.",
    "files.context.nothing.copy": "Nothing to copy.",
    "files.context.nothing.download": "Nothing to download.",
    "url.title": "Website Scraper",
    "url.description.note": "Note:",
    "url.description.cors": "Most websites have CORS restrictions and cannot be accessed directly.",
    "url.description.suggestion": "Suggestion:",
    "url.description.recommend": "Copy webpage content and use the Files function for more stable and reliable processing!",
    "url.input.placeholder": "https://example.com (try it, but most sites will be blocked by CORS)",
    "url.fetch.button": "Fetch",
    "url.fetch.loading": "Fetching...",
    "url.bookmarklet.title": "One-Click Content Extraction Bookmarklet",
    "url.bookmarklet.description": "Drag the link below to your browser bookmarks bar, then click it on any webpage to extract content:",
    "url.bookmarklet.link": "Extract Web Content",
    "url.bookmarklet.instructions": "How to use:",
    "url.bookmarklet.step1": "Right-click the 'Extract Web Content' link above → Select 'Add to Bookmarks Bar'",
    "url.bookmarklet.step2": "Open the webpage you want to extract (e.g., Bilibili, Zhihu, Weibo, etc.)",
    "url.bookmarklet.step3": "Click the 'Extract Web Content' bookmark in your bookmarks bar",
    "url.bookmarklet.step4": "A new window will pop up showing the extracted content, which you can copy or download",
    "url.bookmarklet.step5": "Paste the content into this site's file function for processing",
    "url.bookmarklet.defaultTitle": "Web Content",
    "url.bookmarklet.sourceUrl": "Source URL",
    "url.bookmarklet.captureTime": "Capture Time",
    "url.bookmarklet.success": "Content Extracted Successfully",
    "url.bookmarklet.instruction": "Content has been extracted. Please copy the text below:",
    "url.bookmarklet.copyBtn": "📋 Copy Content",
    "url.bookmarklet.downloadBtn": "💾 Download File",
    "url.bookmarklet.closeBtn": "❌ Close Window",
    "url.bookmarklet.copied": "Copied to clipboard!",
    "url.bookmarklet.smartTitle": "Smart Content Extraction",
    "url.bookmarklet.author": "Author",
    "url.bookmarklet.published": "Published",
    "url.bookmarklet.source": "Source",
    "url.bookmarklet.wordsLabel": "Words",
    "url.bookmarklet.charsLabel": "Characters",
    "url.sources.title": "Source URL",
    "url.sources.download": "Download",
    "footer.text": "Context Builder - AI-powered code analysis tool",
    "language.selector": "Language",
    "language.en": "English",
    "language.zh": "中文",
    "file.type.text": "Text",
    "file.type.binary": "Binary",
    "file.type.config": "Config",
    "file.type.ignored": "Ignored"
  },
  zh: {
    files: "文件",
    url: "网址",
    "files.title": "代码上下文构建器",
    "files.description": "上传文件或文件夹，生成用于AI分析的上下文",
    "files.upload.title": "文件上传",
    "files.upload.description": "将文件/文件夹拖拽到此处，或点击浏览",
    "files.upload.browse": "浏览文件",
    "files.upload.loading": "正在处理文件...",
    "files.sources.title": "源文件",
    "files.sources.empty": "尚未上传文件",
    "files.context.title": "生成的上下文",
    "files.context.placeholder": "处理后的上下文将在此显示...",
    "files.context.copy": "复制上下文",
    "files.context.download": "下载",
    "files.context.copied": "上下文已复制到剪贴板！",
    "files.context.copy.failed": "复制失败。请查看控制台了解详情。",
    "files.context.nothing.copy": "没有可复制的内容。",
    "files.context.nothing.download": "没有可下载的内容。",
    "url.title": "网页抓取器",
    "url.description.note": "注意：",
    "url.description.cors": "大多数网站有跨域限制，无法直接获取。",
    "url.description.suggestion": "建议：",
    "url.description.recommend": "复制网页内容后使用文件功能上传处理，更稳定可靠！",
    "url.input.placeholder": "https://example.com（试试看，但大多数网站会被CORS拦截）",
    "url.fetch.button": "获取",
    "url.fetch.loading": "获取中...",
    "url.bookmarklet.title": "一键抓取书签工具",
    "url.bookmarklet.description": "将下面的链接拖拽到浏览器书签栏，然后在任何网页上点击即可获取内容：",
    "url.bookmarklet.link": "抓取网页内容",
    "url.bookmarklet.instructions": "使用方法：",
    "url.bookmarklet.step1": "右键上面的\"抓取网页内容\"链接 → 选择\"添加到书签栏\"",
    "url.bookmarklet.step2": "打开想要抓取的网页（如B站、知乎、微博等）",
    "url.bookmarklet.step3": "点击书签栏中的\"抓取网页内容\"书签",
    "url.bookmarklet.step4": "会弹出新窗口显示提取的内容，可以复制或下载",
    "url.bookmarklet.step5": "将内容粘贴到本站文件功能进行处理",
    "url.bookmarklet.defaultTitle": "网页内容",
    "url.bookmarklet.sourceUrl": "来源网址",
    "url.bookmarklet.captureTime": "抓取时间",
    "url.bookmarklet.success": "内容提取成功",
    "url.bookmarklet.instruction": "内容已提取完成，请复制下方文本：",
    "url.bookmarklet.copyBtn": "📋 复制内容",
    "url.bookmarklet.downloadBtn": "💾 下载文件",
    "url.bookmarklet.closeBtn": "❌ 关闭窗口",
    "url.bookmarklet.copied": "已复制到剪贴板！",
    "url.bookmarklet.smartTitle": "智能内容提取",
    "url.bookmarklet.author": "作者",
    "url.bookmarklet.published": "发布时间",
    "url.bookmarklet.source": "来源",
    "url.bookmarklet.wordsLabel": "字数",
    "url.bookmarklet.charsLabel": "字符数",
    "url.sources.title": "源网址",
    "url.sources.download": "下载",
    "footer.text": "上下文构建器 - AI驱动的代码分析工具",
    "language.selector": "语言",
    "language.en": "English",
    "language.zh": "中文",
    "file.type.text": "文本",
    "file.type.binary": "二进制",
    "file.type.config": "配置",
    "file.type.ignored": "忽略"
  }
};

const interpolate = (text, params = {}) => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};

// 创建语言上下文
const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 从本地存储获取语言偏好，默认为英文
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('preferred-language');
    return saved || 'en';
  });

  // 保存语言偏好到本地存储
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // 翻译函数
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value === undefined && translations.en) {
      // 回退到英文
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (value === undefined) {
      return key;
    }
    
    return interpolate(value, params);
  };

  // 切换语言函数
  const switchLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  // 获取当前可用语言列表
  const getAvailableLanguages = () => {
    return Object.keys(translations).map(code => ({
      code,
      name: translations[code]['language.' + code] || code.toUpperCase()
    }));
  };

  const value = {
    language,
    t,
    switchLanguage,
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言上下文的Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};