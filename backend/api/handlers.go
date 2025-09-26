package api

import (
	"encoding/json"
	"net/http"
	"time"

	"blog-backend/models"
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

// 注册请求结构体
type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

// 注册响应结构体
type RegisterResponse struct {
	Message string `json:"message"`
	Success bool   `json:"success"`
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

	// 从数据库查询用户
	user, err := models.GetUserByUsername(req.Username)
	if err != nil {
		http.Error(w, "服务器错误", http.StatusInternalServerError)
		return
	}

	// 检查用户是否存在
	if user == nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "用户名或密码错误",
		})
		return
	}

	// 验证密码
	if !models.VerifyPassword(user.Password, req.Password) {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(LoginResponse{
			Message: "用户名或密码错误",
		})
		return
	}

	// 创建JWT token
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: user.Username,
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

// 注册处理函数
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "无效的请求体", http.StatusBadRequest)
		return
	}

	// 简单的输入验证
	if req.Username == "" || req.Password == "" || req.Email == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "用户名、密码和邮箱不能为空",
			Success: false,
		})
		return
	}

	// 检查用户名是否已存在
	existingUser, err := models.GetUserByUsername(req.Username)
	if err != nil {
		http.Error(w, "服务器错误", http.StatusInternalServerError)
		return
	}
	if existingUser != nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "用户名已存在",
			Success: false,
		})
		return
	}

	// 检查邮箱是否已存在
	existingEmail, err := models.GetUserByEmail(req.Email)
	if err != nil {
		http.Error(w, "服务器错误", http.StatusInternalServerError)
		return
	}
	if existingEmail != nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(RegisterResponse{
			Message: "邮箱已被使用",
			Success: false,
		})
		return
	}

	// 创建新用户
	_, err = models.CreateUser(req.Username, req.Password, req.Email)
	if err != nil {
		http.Error(w, "注册失败", http.StatusInternalServerError)
		return
	}

	// 返回注册成功响应
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(RegisterResponse{
		Message: "注册成功",
		Success: true,
	})
}