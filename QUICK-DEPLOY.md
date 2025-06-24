# 🚀 快速部署指南

## 一键部署（推荐）

### macOS/Linux
```bash
./deploy.sh
```

### Windows
```cmd
deploy.bat
```

## 手动部署选项

### 最简单：Vercel（免费）
```bash
npm install -g vercel
npm run build
vercel --prod
```
✅ 自动HTTPS  
✅ 全球CDN  
✅ 零配置  

### 次选：Netlify（免费）
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```
✅ 拖拽部署  
✅ 表单处理  
✅ 分支预览  

### GitHub Pages（免费）
```bash
npm install --save-dev gh-pages
npm run deploy:gh-pages
```
✅ GitHub集成  
✅ 版本控制  
✅ 自动部署  

## 📦 构建文件已准备

你的 `build/` 文件夹包含：
- ✅ 优化的JavaScript包
- ✅ 压缩的CSS文件  
- ✅ 多语言支持
- ✅ 路由配置
- ✅ 静态资源

## 🔥 推荐部署流程

1. **选择 Vercel**（最简单）
2. **运行部署脚本**：`./deploy.sh`
3. **选择选项 1**
4. **获得部署链接** 🎉

## 📋 部署后检查

访问你的网站，确认：
- [ ] 页面正常加载
- [ ] 语言切换工作
- [ ] 文件上传功能
- [ ] 路由 `/files` 和 `/url` 正常

---

需要帮助？查看详细的 `DEPLOYMENT.md` 文件！