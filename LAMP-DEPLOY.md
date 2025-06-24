# 🐧 LAMP 服务器部署指南

## 🚀 一键部署（推荐）

```bash
./lamp-deploy.sh
```

## 📋 手动部署步骤

### 1. 准备服务器环境

确保你的 Debian 服务器已安装：
- ✅ Apache2
- ✅ 启用了必需的模块

```bash
# 在服务器上运行
sudo a2enmod rewrite
sudo a2enmod headers  
sudo a2enmod expires
sudo a2enmod deflate
sudo systemctl restart apache2
```

### 2. 构建应用

在本地运行：
```bash
npm run build
cp .htaccess build/
```

### 3. 上传文件

**方法1：使用 SCP**
```bash
scp -r build/* user@your-server:/var/www/html/llm-context-builder/
```

**方法2：使用 rsync**
```bash
rsync -avz --delete build/ user@your-server:/var/www/html/llm-context-builder/
```

**方法3：手动上传**
- 压缩 build 文件夹
- 通过 FTP/SFTP 上传
- 在服务器上解压

### 4. 设置权限

在服务器上运行：
```bash
sudo chown -R www-data:www-data /var/www/html/llm-context-builder
sudo chmod -R 755 /var/www/html/llm-context-builder
```

### 5. 配置 Virtual Host（可选）

如果需要独立域名：

1. **创建配置文件**
```bash
sudo nano /etc/apache2/sites-available/llm-context-builder.conf
```

2. **使用提供的 apache-vhost.conf 内容**

3. **启用站点**
```bash
sudo a2ensite llm-context-builder.conf
sudo systemctl reload apache2
```

## 🔧 故障排除

### Apache 重写模块未启用
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 权限问题
```bash
sudo chown -R www-data:www-data /var/www/html/llm-context-builder
sudo chmod -R 755 /var/www/html/llm-context-builder
```

### 路由不工作（404 错误）
检查 `.htaccess` 文件是否存在并且 `AllowOverride All` 已配置

### 静态文件不加载
检查文件权限和 Apache 错误日志：
```bash
sudo tail -f /var/log/apache2/error.log
```

## 🌐 访问方式

### 子目录访问
如果部署在 `/var/www/html/llm-context-builder/`：
```
http://your-domain.com/llm-context-builder
```

### 根目录访问
如果部署在 `/var/www/html/`：
```
http://your-domain.com
```

### 子域名访问
配置 Virtual Host 后：
```
http://llm.your-domain.com
```

## 🔐 HTTPS 配置（推荐）

### 使用 Let's Encrypt
```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com
```

### 手动 SSL 证书
编辑 Virtual Host 配置，参考 `apache-vhost.conf` 的 HTTPS 部分

## 📊 性能优化

### 启用 Gzip 压缩
```bash
sudo a2enmod deflate
```

### 设置缓存头
已在 `.htaccess` 中配置

### 启用 HTTP/2（如果支持）
```bash
sudo a2enmod http2
```

## 📋 部署后检查清单

- [ ] 网站能正常访问
- [ ] 语言切换功能正常
- [ ] 文件上传功能正常 
- [ ] URL 页面正常
- [ ] 路由 `/files` 和 `/url` 正常工作
- [ ] 移动端响应式正常
- [ ] 静态资源正常加载
- [ ] Apache 错误日志无异常

## 📁 目录结构

部署后的服务器目录结构：
```
/var/www/html/llm-context-builder/
├── index.html
├── .htaccess
├── static/
│   ├── css/
│   └── js/
└── asset-manifest.json
```

---

需要帮助？检查 Apache 错误日志或联系系统管理员。