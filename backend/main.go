package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"blog-backend/api"
	"blog-backend/config"
	"blog-backend/db"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化数据库连接
	if err := db.InitDB(cfg); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}
	// 确保在程序退出时关闭数据库连接
	defer func() {
		if err := db.CloseDB(); err != nil {
			log.Printf("关闭数据库连接失败: %v", err)
		}
	}()

	// 创建路由器
	r := mux.NewRouter()

	// 设置API路由
	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/login", api.LoginHandler).Methods("POST")
	apiRouter.HandleFunc("/register", api.RegisterHandler).Methods("POST")
	apiRouter.HandleFunc("/health", api.HealthCheck).Methods("GET")

	// 配置CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"}, // 支持多个前端开发服务器地址
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// 包装路由器以处理CORS
	handler := c.Handler(r)

	// 启动服务器
	server := &http.Server{
		Addr:    ":8080",
		Handler: handler,
	}

	// 启动服务器在后台
	go func() {
		log.Println("Server starting on :8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("启动服务器失败: %v", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("服务器正在关闭...")
}