@echo off
chcp 65001 >nul
echo 🚀 LLM Context Builder 部署脚本
echo ==================================

REM 检查是否已构建
if not exist "build" (
    echo 📦 正在构建应用...
    call npm run build
    if errorlevel 1 (
        echo ❌ 构建失败，请检查错误信息
        pause
        exit /b 1
    )
    echo ✅ 构建完成
)

echo.
echo 请选择部署方式：
echo 1) Vercel (推荐)
echo 2) Netlify  
echo 3) GitHub Pages
echo 4) 本地预览
echo 5) 生成压缩包用于手动部署

set /p choice=请输入选择 (1-5): 

if "%choice%"=="1" (
    echo 🚀 部署到 Vercel...
    vercel --version >nul 2>&1 || (
        echo 📦 安装 Vercel CLI...
        call npm install -g vercel
    )
    call vercel --prod
) else if "%choice%"=="2" (
    echo 🚀 部署到 Netlify...
    netlify --version >nul 2>&1 || (
        echo 📦 安装 Netlify CLI...
        call npm install -g netlify-cli
    )
    call netlify deploy --prod --dir=build
) else if "%choice%"=="3" (
    echo 🚀 部署到 GitHub Pages...
    call npm run deploy:gh-pages
) else if "%choice%"=="4" (
    echo 🖥 启动本地预览...
    echo 预览地址: http://localhost:5000
    call npm run serve
) else if "%choice%"=="5" (
    echo 📁 生成部署压缩包...
    powershell -Command "Compress-Archive -Path 'build\*' -DestinationPath 'llm-context-builder-deploy.zip' -Force"
    echo ✅ 部署包已生成: llm-context-builder-deploy.zip
    echo 💡 解压到你的 web 服务器根目录即可
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

echo.
echo 🎉 部署完成！
pause