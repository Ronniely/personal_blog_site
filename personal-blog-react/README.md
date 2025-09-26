# 个人博客网站

这是一个使用 React + TypeScript + Vite 构建的个人博客网站。

## 项目结构

```
.
├── personal-blog/     # 前端项目
│   ├── src/
│   │   ├── components/  # 公共组件
│   │   ├── pages/       # 页面组件
│   │   └── ...
│   └── ...
└── backend/           # 后端服务 (Go)
    ├── api/
    ├── main.go
    └── go.mod
```

## 前端运行说明

1. 安装依赖：

   ```bash
   npm install
   ```

2. 运行开发服务器：

   ```bash
   npm run dev
   ```

3. 访问地址：http://localhost:5173

## 后端服务 (Go)

后端使用 Go 语言构建，提供 RESTful API 接口。

### 目录结构

```
backend/
├── main.go         # 主程序入口
├── go.mod          # Go 模块定义
├── go.sum          # Go 模块校验和
├── start.bat       # Windows 启动脚本
└── api/
    └── handlers.go # API 处理函数
```

### API 接口

- POST /api/login - 用户登录接口
- GET /api/health - 健康检查接口

### 运行后端服务

#### 方法一：使用启动脚本 (Windows)

```bash
cd backend
start.bat
```

#### 方法二：手动运行

1. 确保已安装 Go 1.21 或更高版本
2. 进入 backend 目录：
   ```bash
   cd backend
   ```
3. 安装依赖：
   ```bash
   go mod tidy
   ```
4. 运行服务：

   ```bash
   go run main.go
   ```

5. 后端服务将运行在：http://localhost:8080

### 默认登录账户

- 用户名：admin
- 密码：password123

## 功能说明

### 已实现功能

1. 博客文章展示
2. 分类和标签管理
3. 文章搜索功能
4. 用户登录系统
5. 权限保护（文章上传需要登录）

### 安全特性

1. JWT Token 认证
2. CORS 跨域配置
3. 密码验证
4. 路由保护

## 开发说明

### 前端技术栈

- React 18
- TypeScript
- React Router v6
- Vite 构建工具

### 后端技术栈

- Go 1.21+
- Gorilla Mux 路由库
- RS/CORS 跨域处理
- JWT 认证

### 代码规范

- 前端遵循 TypeScript 最佳实践
- 后端遵循 Go 语言编码规范
- 组件化开发模式
