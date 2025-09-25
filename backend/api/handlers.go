package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// 登录请求结构体
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// 登录响应结构体
type LoginResponse struct {
	Token   string `json:"token"`
	Message string `json:"message"`
}

// JWT密钥（在实际应用中应该从环境变量读取）
var jwtKey = []byte("my_secret_key")

// Claims JWT声明结构体
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// 登录处理函数
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "无效的请求体", http.StatusBadRequest)
		return
	}

	// 简单的用户名密码验证（实际应用中应该查询数据库）
	if req.Username != "admin" || req.Password != "password123" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "用户名或密码错误",
		})
		return
	}

	// 创建JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: req.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "无法生成token", http.StatusInternalServerError)
		return
	}

	// 返回token
	response := LoginResponse{
		Token:   tokenString,
		Message: "登录成功",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// 健康检查处理函数
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}