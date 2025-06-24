# LLM Context Builder 部署指南

## 🚀 快速部署选项

### 选项1：Vercel（推荐 - 最简单）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

3. **或者使用 GitHub 集成**
   - 访问 [vercel.com](https://vercel.com)
   - 用 GitHub 账号登录
   - 导入你的仓库
   - 自动部署完成！

### 选项2：Netlify

1. **使用 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build
   ```

2. **或者拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 直接拖拽 `build` 文件夹到页面上
   - 立即获得部署链接！

### 选项3：GitHub Pages

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **添加部署脚本到 package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **部署**
   ```bash
   npm run deploy
   ```

## 🛠 自托管服务器部署

### Apache 服务器

1. **构建应用**
   ```bash
   npm run build
   ```

2. **上传 build 文件夹到服务器**

3. **创建 .htaccess 文件**
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QSA,L]
   ```

### Nginx 服务器

1. **上传 build 文件夹内容到 web 根目录**

2. **使用提供的 nginx.conf 配置**

3. **重启 Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

## 🐳 Docker 部署

### Dockerfile
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 构建和运行
```bash
docker build -t llm-context-builder .
docker run -p 80:80 llm-context-builder
```

## ☁️ 其他云服务选项

### AWS S3 + CloudFront
1. 创建 S3 bucket
2. 启用静态网站托管
3. 上传 build 文件夹内容
4. 配置 CloudFront 分发

### Google Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 环境变量配置

如果需要环境变量，在 `.env` 文件中添加（以 REACT_APP_ 开头）：
```env
REACT_APP_API_URL=https://your-api.com
REACT_APP_ANALYTICS_ID=your-analytics-id
```

## 📦 CDN 优化

在 `public/index.html` 中添加 CDN 预加载：
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="//your-cdn.com">
```

## 🔐 HTTPS 配置

大多数现代部署平台（Vercel、Netlify）自动提供 HTTPS。
自托管服务器可使用 Let's Encrypt：

```bash
sudo certbot --nginx -d your-domain.com
```

## 🚦 部署后检查清单

- [ ] 网站能正常访问
- [ ] 语言切换功能正常
- [ ] 文件上传功能正常
- [ ] URL 功能正常（虽然受 CORS 限制）
- [ ] 复制/下载功能正常
- [ ] 移动端响应式正常
- [ ] 所有路由正常工作（/files, /url）

## 📊 性能优化建议

1. **启用 Gzip 压缩**
2. **设置静态资源缓存**
3. **使用 CDN 加速**
4. **启用浏览器缓存**

---

选择最适合你的部署方式开始吧！推荐新手使用 Vercel 或 Netlify。