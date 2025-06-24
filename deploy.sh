#!/bin/bash

echo "🚀 LLM Context Builder 部署脚本"
echo "=================================="

# 检查是否已构建
if [ ! -d "build" ]; then
    echo "📦 正在构建应用..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败，请检查错误信息"
        exit 1
    fi
    echo "✅ 构建完成"
fi

echo ""
echo "请选择部署方式："
echo "1) Vercel (推荐)"
echo "2) Netlify"
echo "3) GitHub Pages"
echo "4) 本地预览"
echo "5) 生成压缩包用于手动部署"

read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo "🚀 部署到 Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 安装 Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 部署到 Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 安装 Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=build
        ;;
    3)
        echo "🚀 部署到 GitHub Pages..."
        if ! npm list gh-pages &> /dev/null; then
            echo "📦 安装 gh-pages..."
            npm install --save-dev gh-pages
        fi
        npm run deploy:gh-pages
        ;;
    4)
        echo "🖥 启动本地预览..."
        echo "预览地址: http://localhost:5000"
        npm run serve
        ;;
    5)
        echo "📁 生成部署压缩包..."
        tar -czf llm-context-builder-deploy.tar.gz -C build .
        echo "✅ 部署包已生成: llm-context-builder-deploy.tar.gz"
        echo "💡 解压到你的 web 服务器根目录即可"
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"