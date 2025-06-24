#!/bin/bash

echo "🔍 LAMP 服务器环境检查脚本"
echo "=========================="
echo ""

if [ -z "$1" ]; then
    read -p "请输入服务器地址: " SERVER
else
    SERVER=$1
fi

if [ -z "$2" ]; then
    read -p "请输入 SSH 用户名: " USER
else
    USER=$2
fi

echo ""
echo "🔍 检查服务器环境..."
echo ""

# 检查 Apache
echo "📋 Apache 状态："
ssh ${USER}@${SERVER} "
    if systemctl is-active --quiet apache2; then
        echo '✅ Apache2 正在运行'
        apache2 -v | head -1
    else
        echo '❌ Apache2 未运行'
    fi
"

echo ""
echo "🔧 Apache 模块检查："
ssh ${USER}@${SERVER} "
    echo -n 'mod_rewrite: '
    if apache2ctl -M 2>/dev/null | grep -q rewrite; then
        echo '✅ 已启用'
    else
        echo '❌ 未启用 - 运行: sudo a2enmod rewrite'
    fi
    
    echo -n 'mod_headers: '
    if apache2ctl -M 2>/dev/null | grep -q headers; then
        echo '✅ 已启用'
    else
        echo '❌ 未启用 - 运行: sudo a2enmod headers'
    fi
    
    echo -n 'mod_expires: '
    if apache2ctl -M 2>/dev/null | grep -q expires; then
        echo '✅ 已启用'
    else
        echo '⚠️ 未启用 - 建议运行: sudo a2enmod expires'
    fi
    
    echo -n 'mod_deflate: '
    if apache2ctl -M 2>/dev/null | grep -q deflate; then
        echo '✅ 已启用'
    else
        echo '⚠️ 未启用 - 建议运行: sudo a2enmod deflate'
    fi
"

echo ""
echo "📁 目录权限检查："
ssh ${USER}@${SERVER} "
    if [ -d '/var/www/html' ]; then
        echo '✅ /var/www/html 存在'
        ls -la /var/www/html/ | head -3
    else
        echo '❌ /var/www/html 不存在'
    fi
"

echo ""
echo "💾 磁盘空间："
ssh ${USER}@${SERVER} "df -h /var/www/"

echo ""
echo "🌐 网络连接测试："
if ping -c 1 ${SERVER} >/dev/null 2>&1; then
    echo "✅ 服务器网络连接正常"
else
    echo "❌ 无法连接到服务器"
fi

echo ""
echo "📊 系统信息："
ssh ${USER}@${SERVER} "
    echo 'OS: '$(lsb_release -d | cut -f2)
    echo 'PHP: '$(php -v 2>/dev/null | head -1 || echo 'Not installed')
    echo 'MySQL: '$(mysql --version 2>/dev/null || echo 'Not installed')
"

echo ""
echo "🔧 建议的准备命令："
echo "ssh ${USER}@${SERVER}"
echo "sudo a2enmod rewrite headers expires deflate"
echo "sudo mkdir -p /var/www/html/llm-context-builder"
echo "sudo chown -R www-data:www-data /var/www/html/llm-context-builder"
echo "sudo systemctl restart apache2"