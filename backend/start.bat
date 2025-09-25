@echo off
echo 正在启动博客后端服务...
echo 请确保已安装 Go 1.21 或更高版本
echo.

REM 检查是否安装了 Go
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Go 环境，请先安装 Go 1.21 或更高版本
    echo 下载地址: https://golang.org/dl/
    pause
    exit /b 1
)

REM 安装依赖
echo 正在安装依赖...
go mod tidy
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

REM 启动服务
echo.
echo 后端服务正在运行在 http://localhost:8080
echo 按 Ctrl+C 停止服务
echo.
go run main.go

pause