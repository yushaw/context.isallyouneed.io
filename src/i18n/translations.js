// 多语言翻译文件
export const translations = {
  en: {
    // Header
    files: "Files",
    url: "URL",
    
    // Files Page
    "files.title": "Code Context Builder",
    "files.description": "Upload files or folders to generate context for AI analysis",
    "files.upload.title": "File Upload",
    "files.upload.description": "Drag and drop files/folders here, or click to browse",
    "files.upload.browse": "Browse Files",
    "files.upload.loading": "Processing files...",
    "files.sources.title": "Sources",
    "files.sources.empty": "No files uploaded yet",
    "files.sources.clear": "Clear All",
    "files.upload.processor.title": "File Processor",
    "files.upload.processor.description": "Upload files, folders, or a ZIP archive. Text-based files within folders/ZIPs will be extracted.",
    "files.upload.processing": "Please wait while we process your files",
    "files.context.title": "Generated Context",
    "files.context.placeholder": "Processed context will appear here...",
    "files.context.copy": "Copy Context",
    "files.context.download": "Download",
    "files.context.copied": "Context copied to clipboard!",
    "files.context.copy.failed": "Failed to copy context. See console for details.",
    "files.context.nothing.copy": "Nothing to copy.",
    "files.context.nothing.download": "Nothing to download.",
    
    // URL Page
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
    "url.sources.title": "Source URL",
    "url.sources.download": "Download",
    
    // Error Messages
    "error.fetch.failed": "🚫 Unable to access this website",
    "error.fetch.cors": "❌ Reason: {hostname} has cross-origin protection enabled",
    "error.fetch.solutions": "✅ Recommended Solutions:",
    "error.method.copy": "📋 Method 1: Copy & Paste (Simplest)",
    "error.method.copy.step1": "1. Open the webpage in your browser",
    "error.method.copy.step2": "2. Copy the text content you need (Ctrl/Cmd+A to select all)",
    "error.method.copy.step3": "3. Create a new text file and paste",
    "error.method.copy.step4": "4. Use this site's 'Files' function to upload and process",
    "error.method.save": "📁 Method 2: Save Webpage",
    "error.method.save.step1": "1. Right-click in browser → 'Save As' → Select 'Webpage, HTML Only'",
    "error.method.save.step2": "2. Use this site's 'Files' function to upload the HTML file",
    "error.method.devtools": "🔧 Method 3: Developer Tools",
    "error.method.devtools.step1": "1. Press F12 to open Developer Tools",
    "error.method.devtools.step2": "2. Run in Console: copy(document.body.innerText)",
    "error.method.devtools.step3": "3. Content is copied to clipboard, paste into text file",
    "error.cors.tip": "💡 Tip: Most websites (like Bilibili, Weibo, Zhihu, etc.) have CORS restrictions, which is a normal security mechanism.",
    "error.network.title": "🌐 Network Connection Problem",
    "error.network.check": "🔧 Please check:",
    "error.network.connection": "- Is network connection normal",
    "error.network.url": "- Is the URL address correct",
    "error.network.vpn": "- Are you using VPN or proxy",
    "error.network.suggestion": "💡 Suggestion: Try testing if the URL can be accessed normally in browser first",
    "error.404.title": "📄 Page Not Found",
    "error.404.message": "❌ The page at this URL does not exist or has been deleted",
    "error.404.check": "🔧 Please check:",
    "error.404.url.complete": "- Is the URL address complete and correct",
    "error.404.moved": "- Has the page been moved or deleted",
    "error.404.login": "- Does it require login to access",
    "error.general.title": "⚠️ Fetch Failed",
    "error.general.message": "❌ Error message: {error}",
    "error.general.reasons": "🔧 Possible reasons:",
    "error.general.server": "- Server not responding or overloaded",
    "error.general.format": "- Incorrect URL format",
    "error.general.permission": "- Requires special permissions or login",
    "error.general.blocked": "- Website blocks automated access",
    "error.general.suggestion": "💡 Suggestion: Use copy-paste method to get content",
    
    // Input validation
    "input.url.required": "Please enter a URL",
    "input.url.invalid": "Please enter a valid URL format",
    
    // File types
    "file.type.text": "Text",
    "file.type.binary": "Binary",
    "file.type.config": "Config",
    "file.type.ignored": "Ignored",
    "file.unreadable": "Cannot read content",
    
    // Footer
    "footer.text": "Context Builder - AI-powered code analysis tool",
    
    // Content processing
    "content.truncated": "content truncated due to {reason}",
    "content.truncated.length": "length limit",
    
    // Language Selector
    "language.selector": "Language",
    "language.en": "English",
    "language.zh": "中文"
  },
  
  zh: {
    // Header
    files: "文件",
    url: "网址",
    
    // Files Page
    "files.title": "代码上下文构建器",
    "files.description": "上传文件或文件夹，生成用于AI分析的上下文",
    "files.upload.title": "文件上传",
    "files.upload.description": "将文件/文件夹拖拽到此处，或点击浏览",
    "files.upload.browse": "浏览文件",
    "files.upload.loading": "正在处理文件...",
    "files.sources.title": "源文件",
    "files.sources.empty": "尚未上传文件",
    "files.sources.clear": "清空所有",
    "files.upload.processor.title": "文件处理器",
    "files.upload.processor.description": "上传文件、文件夹或ZIP压缩包。文件夹/ZIP内的文本文件将被提取。",
    "files.upload.processing": "正在处理您的文件，请稍候",
    "files.context.title": "生成的上下文",
    "files.context.placeholder": "处理后的上下文将在此显示...",
    "files.context.copy": "复制上下文",
    "files.context.download": "下载",
    "files.context.copied": "上下文已复制到剪贴板！",
    "files.context.copy.failed": "复制失败。请查看控制台了解详情。",
    "files.context.nothing.copy": "没有可复制的内容。",
    "files.context.nothing.download": "没有可下载的内容。",
    
    // URL Page
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
    "url.sources.title": "源网址",
    "url.sources.download": "下载",
    
    // Error Messages
    "error.fetch.failed": "🚫 无法访问该网站",
    "error.fetch.cors": "❌ 原因：{hostname} 启用了跨域保护",
    "error.fetch.solutions": "✅ 推荐解决方案：",
    "error.method.copy": "📋 方法一：复制粘贴（最简单）",
    "error.method.copy.step1": "1. 在浏览器中打开该网页",
    "error.method.copy.step2": "2. 复制需要的文本内容 (Ctrl/Cmd+A 全选)",
    "error.method.copy.step3": "3. 创建新的文本文件并粘贴",
    "error.method.copy.step4": "4. 使用本站的\"文件\"功能上传处理",
    "error.method.save": "📁 方法二：保存网页",
    "error.method.save.step1": "1. 浏览器中右键 → \"另存为\" → 选择\"网页，仅HTML\"",
    "error.method.save.step2": "2. 使用本站\"文件\"功能上传HTML文件",
    "error.method.devtools": "🔧 方法三：开发者工具",
    "error.method.devtools.step1": "1. 按F12打开开发者工具",
    "error.method.devtools.step2": "2. 在Console中运行：copy(document.body.innerText)",
    "error.method.devtools.step3": "3. 内容已复制到剪贴板，粘贴到文本文件即可",
    "error.cors.tip": "💡 小贴士：大多数网站（如B站、微博、知乎等）都有跨域限制，这是正常的安全机制。",
    "error.network.title": "🌐 网络连接问题",
    "error.network.check": "🔧 请检查：",
    "error.network.connection": "- 网络连接是否正常",
    "error.network.url": "- URL地址是否正确",
    "error.network.vpn": "- 是否使用了VPN或代理",
    "error.network.suggestion": "💡 建议：可以先在浏览器中测试该URL是否能正常访问",
    "error.404.title": "📄 页面不存在",
    "error.404.message": "❌ 该URL指向的页面不存在或已被删除",
    "error.404.check": "🔧 请检查：",
    "error.404.url.complete": "- URL地址是否完整正确",
    "error.404.moved": "- 页面是否已被移动或删除",
    "error.404.login": "- 是否需要登录才能访问",
    "error.general.title": "⚠️ 获取失败",
    "error.general.message": "❌ 错误信息：{error}",
    "error.general.reasons": "🔧 可能的原因：",
    "error.general.server": "- 服务器无响应或过载",
    "error.general.format": "- URL格式不正确",
    "error.general.permission": "- 需要特殊权限或登录",
    "error.general.blocked": "- 网站屏蔽了自动访问",
    "error.general.suggestion": "💡 建议：使用复制粘贴的方式获取内容",
    
    // Input validation
    "input.url.required": "请输入一个URL",
    "input.url.invalid": "请输入有效的URL格式",
    
    // File types
    "file.type.text": "文本",
    "file.type.binary": "二进制",
    "file.type.config": "配置",
    "file.type.ignored": "忽略",
    "file.unreadable": "无法读取内容",
    
    // Footer
    "footer.text": "上下文构建器 - AI驱动的代码分析工具",
    
    // Content processing
    "content.truncated": "内容因{reason}被截断",
    "content.truncated.length": "长度限制",
    
    // Language Selector
    "language.selector": "语言",
    "language.en": "English",
    "language.zh": "中文"
  }
};

// 语言键值替换函数
export const interpolate = (text, params = {}) => {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};