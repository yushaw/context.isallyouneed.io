// 智能内容提取和 Markdown 转换工具

// 获取页面元数据
function extractMetadata() {
  const metadata = {
    title: document.title || '',
    author: '',
    description: '',
    publishDate: '',
    favicon: '',
    siteName: '',
    url: window.location.href
  };

  // 提取作者
  const authorMeta = document.querySelector('meta[name="author"], meta[property="article:author"]');
  if (authorMeta) metadata.author = authorMeta.content;
  
  // 提取描述
  const descMeta = document.querySelector('meta[name="description"], meta[property="og:description"]');
  if (descMeta) metadata.description = descMeta.content;
  
  // 提取发布时间
  const dateMeta = document.querySelector('meta[property="article:published_time"], time[datetime]');
  if (dateMeta) {
    metadata.publishDate = dateMeta.content || dateMeta.dateTime;
  }
  
  // 提取站点名称
  const siteMeta = document.querySelector('meta[property="og:site_name"]');
  if (siteMeta) metadata.siteName = siteMeta.content;
  
  // 提取 favicon
  const favicon = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (favicon) metadata.favicon = favicon.href;

  return metadata;
}

// 智能识别主体内容
function extractMainContent() {
  // 优先级选择器列表
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.post-content',
    '.entry-content',
    '.content',
    '#content',
    '.article-body',
    '.story-body',
    '.blog-post',
    '.markdown-body',
    '.prose'
  ];

  // 尝试找到主要内容区域
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 200) {
      return element;
    }
  }

  // 如果没找到，使用启发式方法
  const allParagraphs = document.querySelectorAll('p');
  let bestContainer = document.body;
  let maxScore = 0;

  // 计算每个容器的得分
  const containers = new Set();
  allParagraphs.forEach(p => {
    let parent = p.parentElement;
    while (parent && parent !== document.body) {
      containers.add(parent);
      parent = parent.parentElement;
    }
  });

  containers.forEach(container => {
    const paragraphs = container.querySelectorAll('p');
    const textLength = Array.from(paragraphs).reduce((sum, p) => sum + p.textContent.length, 0);
    const score = textLength / (1 + container.querySelectorAll('*').length * 0.01);
    
    if (score > maxScore) {
      maxScore = score;
      bestContainer = container;
    }
  });

  return bestContainer;
}

// HTML 到 Markdown 转换
function htmlToMarkdown(element) {
  const lines = [];
  
  function processNode(node, listLevel = 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        lines.push(text);
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tagName = node.tagName.toLowerCase();
    
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        const level = parseInt(tagName.charAt(1));
        lines.push('\n' + '#'.repeat(level) + ' ' + node.textContent.trim() + '\n');
        break;
        
      case 'p':
        lines.push('\n' + node.textContent.trim() + '\n');
        break;
        
      case 'strong':
      case 'b':
        lines.push('**' + node.textContent.trim() + '**');
        break;
        
      case 'em':
      case 'i':
        lines.push('*' + node.textContent.trim() + '*');
        break;
        
      case 'code':
        if (node.parentElement.tagName === 'PRE') {
          // 代码块
          const lang = node.className.replace('language-', '');
          lines.push('\n```' + lang + '\n' + node.textContent + '\n```\n');
        } else {
          // 内联代码
          lines.push('`' + node.textContent + '`');
        }
        break;
        
      case 'pre':
        if (!node.querySelector('code')) {
          lines.push('\n```\n' + node.textContent + '\n```\n');
        } else {
          Array.from(node.childNodes).forEach(child => processNode(child, listLevel));
        }
        break;
        
      case 'blockquote':
        const quoteLines = [];
        const tempLines = lines.length;
        Array.from(node.childNodes).forEach(child => processNode(child, listLevel));
        const quoteContent = lines.slice(tempLines).join('');
        lines.length = tempLines;
        lines.push('\n' + quoteContent.split('\n').map(line => '> ' + line).join('\n') + '\n');
        break;
        
      case 'a':
        const href = node.getAttribute('href');
        const text = node.textContent.trim();
        if (href && href !== text) {
          lines.push('[' + text + '](' + href + ')');
        } else {
          lines.push(text);
        }
        break;
        
      case 'img':
        const src = node.getAttribute('src');
        const alt = node.getAttribute('alt') || '';
        if (src) {
          lines.push('![' + alt + '](' + src + ')');
        }
        break;
        
      case 'ul':
      case 'ol':
        lines.push('\n');
        Array.from(node.children).forEach((child, index) => {
          if (child.tagName === 'LI') {
            const prefix = tagName === 'ul' ? 
              '  '.repeat(listLevel) + '- ' : 
              '  '.repeat(listLevel) + (index + 1) + '. ';
            const tempLines = lines.length;
            Array.from(child.childNodes).forEach(grandchild => {
              if (grandchild.tagName === 'UL' || grandchild.tagName === 'OL') {
                processNode(grandchild, listLevel + 1);
              } else {
                processNode(grandchild, listLevel);
              }
            });
            const content = lines.slice(tempLines).join('').trim();
            lines.length = tempLines;
            lines.push(prefix + content + '\n');
          }
        });
        lines.push('\n');
        break;
        
      case 'table':
        lines.push('\n');
        const rows = Array.from(node.querySelectorAll('tr'));
        if (rows.length > 0) {
          rows.forEach((row, rowIndex) => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            const cellContents = cells.map(cell => cell.textContent.trim().replace(/\|/g, '\\|'));
            lines.push('| ' + cellContents.join(' | ') + ' |\n');
            
            // 添加分隔行
            if (rowIndex === 0 && row.querySelector('th')) {
              lines.push('| ' + cells.map(() => '---').join(' | ') + ' |\n');
            }
          });
        }
        lines.push('\n');
        break;
        
      case 'hr':
        lines.push('\n---\n');
        break;
        
      case 'br':
        lines.push('  \n');
        break;
        
      default:
        // 递归处理子节点
        Array.from(node.childNodes).forEach(child => processNode(child, listLevel));
    }
  }

  Array.from(element.childNodes).forEach(child => processNode(child));
  
  // 清理多余的空行
  return lines.join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 清理内容（移除脚本、样式、广告等）
function cleanContent(element) {
  const clone = element.cloneNode(true);
  
  // 移除不需要的元素
  const removeSelectors = [
    'script',
    'style',
    'noscript',
    'iframe',
    '.advertisement',
    '.ads',
    '.social-share',
    '.comments',
    '.related-posts',
    '[class*="share"]',
    '[class*="social"]',
    '[id*="ads"]',
    '[id*="advertisement"]'
  ];
  
  removeSelectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  return clone;
}

// 主函数：提取并转换内容
function extractAndConvertContent() {
  try {
    // 提取元数据
    const metadata = extractMetadata();
    
    // 提取主要内容
    const mainContent = extractMainContent();
    const cleanedContent = cleanContent(mainContent);
    
    // 转换为 Markdown
    const markdownContent = htmlToMarkdown(cleanedContent);
    
    // 组装最终结果
    let result = `# ${metadata.title}\n\n`;
    
    if (metadata.author) {
      result += `**Author:** ${metadata.author}  \n`;
    }
    if (metadata.publishDate) {
      result += `**Published:** ${new Date(metadata.publishDate).toLocaleDateString()}  \n`;
    }
    if (metadata.siteName) {
      result += `**Source:** ${metadata.siteName}  \n`;
    }
    
    result += `**URL:** ${metadata.url}  \n`;
    result += `**Captured:** ${new Date().toLocaleString()}  \n\n`;
    result += `---\n\n`;
    
    if (metadata.description) {
      result += `> ${metadata.description}\n\n`;
    }
    
    result += markdownContent;
    
    return result;
  } catch (error) {
    console.error('Content extraction error:', error);
    // 降级到简单文本提取
    return `# ${document.title}\n\n**URL:** ${window.location.href}\n**Captured:** ${new Date().toLocaleString()}\n\n---\n\n${document.body.innerText}`;
  }
}

// 导出函数供书签工具使用
window.contentExtractor = {
  extract: extractAndConvertContent,
  extractMetadata,
  extractMainContent,
  htmlToMarkdown
};