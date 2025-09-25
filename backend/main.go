package main

import (
	"log"
	"net/http"

	"blog-backend/api"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// 创建路由器
	r := mux.NewRouter()

	// 设置API路由
	apiRouter := r.PathPrefix("/api").Subrouter()
	apiRouter.HandleFunc("/login", api.LoginHandler).Methods("POST")
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
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}