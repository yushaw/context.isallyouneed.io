#!/bin/bash

echo "🐧 LAMP 服务器部署脚本"
echo "======================="
echo ""

# 默认配置
DEFAULT_HOST=""
DEFAULT_PATH="/var/www/html/llm-context-builder"
DEFAULT_USER="root"

echo "请输入服务器信息："
read -p "服务器地址 (IP 或域名): " SERVER_HOST
read -p "部署路径 [${DEFAULT_PATH}]: " DEPLOY_PATH
read -p "SSH 用户名 [${DEFAULT_USER}]: " SSH_USER

# 使用默认值如果为空
SERVER_HOST=${SERVER_HOST:-$DEFAULT_HOST}
DEPLOY_PATH=${DEPLOY_PATH:-$DEFAULT_PATH}
SSH_USER=${SSH_USER:-$DEFAULT_USER}

if [ -z "$SERVER_HOST" ]; then
    echo "❌ 服务器地址不能为空"
    exit 1
fi

echo ""
echo "📋 部署配置："
echo "服务器: ${SSH_USER}@${SERVER_HOST}"
echo "路径: ${DEPLOY_PATH}"
echo ""

read -p "确认部署？(y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ 部署已取消"
    exit 0
fi

echo ""
echo "📦 构建应用..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建完成"
echo ""

# 将 .htaccess 复制到 build 目录
echo "📄 添加 Apache 配置..."
cp .htaccess build/

echo "📤 上传文件到服务器..."

# 创建临时目录结构
ssh ${SSH_USER}@${SERVER_HOST} "sudo mkdir -p ${DEPLOY_PATH} && sudo chown -R www-data:www-data ${DEPLOY_PATH}"

# 上传文件
scp -r build/* ${SSH_USER}@${SERVER_HOST}:${DEPLOY_PATH}/

if [ $? -eq 0 ]; then
    echo "✅ 文件上传成功"
else
    echo "❌ 文件上传失败"
    exit 1
fi

echo ""
echo "🔧 配置服务器权限..."

# 设置正确的权限
ssh ${SSH_USER}@${SERVER_HOST} "
    sudo chown -R www-data:www-data ${DEPLOY_PATH}
    sudo chmod -R 755 ${DEPLOY_PATH}
    sudo a2enmod rewrite
    sudo a2enmod headers
    sudo a2enmod expires
    sudo a2enmod deflate
    sudo systemctl reload apache2
"

echo ""
echo "🎉 部署完成！"
echo ""
echo "🌐 访问地址："
if [[ $DEPLOY_PATH == "/var/www/html" ]]; then
    echo "   http://${SERVER_HOST}"
else
    FOLDER_NAME=$(basename $DEPLOY_PATH)
    echo "   http://${SERVER_HOST}/${FOLDER_NAME}"
fi

echo ""
echo "📋 部署后检查清单："
echo "  □ 访问网站确认正常加载"
echo "  □ 测试语言切换功能" 
echo "  □ 测试文件上传功能"
echo "  □ 测试路由 /files 和 /url"
echo "  □ 检查移动端显示"