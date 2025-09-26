package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/jayden/personal-blog-backend/models"
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

// GetArticlesHandler 获取文章列表
func GetArticlesHandler(w http.ResponseWriter, r *http.Request) {
	// 获取分页参数
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	page := 1
	limit := 10

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	offset := (page - 1) * limit

	// 获取文章列表
	articles, err := models.GetArticles(limit, offset)
	if err != nil {
		http.Error(w, "获取文章列表失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": articles,
		"msg":  "获取成功",
	})
}

// GetArticleDetailHandler 获取文章详情
func GetArticleDetailHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "文章ID不能为空", http.StatusBadRequest)
		return
	}

	// 获取文章详情
	article, err := models.GetArticleByID(id)
	if err != nil {
		http.Error(w, "获取文章详情失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if article == nil {
		http.Error(w, "文章不存在", http.StatusNotFound)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": article,
		"msg":  "获取成功",
	})
}

// CreateArticleHandler 创建文章
func CreateArticleHandler(w http.ResponseWriter, r *http.Request) {
	// 解析请求体
	var article models.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		http.Error(w, "请求体解析失败: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 验证必填字段
	if article.Title == "" || article.Content == "" || article.CategoryID == "" {
		http.Error(w, "标题、内容和分类不能为空", http.StatusBadRequest)
		return
	}

	// 设置创建和更新时间
	article.CreatedAt = time.Now()
	article.UpdatedAt = time.Now()

	// 创建文章
	if err := models.CreateArticle(&article); err != nil {
		http.Error(w, "创建文章失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": article,
		"msg":  "创建成功",
	})
}

// UpdateArticleHandler 更新文章
func UpdateArticleHandler(w http.ResponseWriter, r *http.Request) {
	// 解析请求体
	var article models.Article
	if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
		http.Error(w, "请求体解析失败: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 验证必填字段
	if article.ID == "" || article.Title == "" || article.Content == "" || article.CategoryID == "" {
		http.Error(w, "ID、标题、内容和分类不能为空", http.StatusBadRequest)
		return
	}

	// 设置更新时间
	article.UpdatedAt = time.Now()

	// 更新文章
	if err := models.UpdateArticle(&article); err != nil {
		http.Error(w, "更新文章失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": article,
		"msg":  "更新成功",
	})
}

// DeleteArticleHandler 删除文章
func DeleteArticleHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "文章ID不能为空", http.StatusBadRequest)
		return
	}

	// 删除文章
	if err := models.DeleteArticle(id); err != nil {
		http.Error(w, "删除文章失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": nil,
		"msg":  "删除成功",
	})
}

// GetCategoriesHandler 获取分类列表
func GetCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	// 获取分类列表
	categories, err := models.GetCategories()
	if err != nil {
		http.Error(w, "获取分类列表失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": categories,
		"msg":  "获取成功",
	})
}

// GetTagsHandler 获取标签列表
func GetTagsHandler(w http.ResponseWriter, r *http.Request) {
	// 获取标签列表
	tags, err := models.GetTags()
	if err != nil {
		http.Error(w, "获取标签列表失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": tags,
		"msg":  "获取成功",
	})
}

// GetArticlesByCategoryHandler 根据分类ID获取文章
func GetArticlesByCategoryHandler(w http.ResponseWriter, r *http.Request) {
	categoryID := r.URL.Query().Get("categoryId")
	if categoryID == "" {
		http.Error(w, "分类ID不能为空", http.StatusBadRequest)
		return
	}

	// 获取分页参数
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	page := 1
	limit := 10

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	offset := (page - 1) * limit

	// 根据分类ID获取文章
	articles, err := models.GetArticlesByCategoryID(categoryID, limit, offset)
	if err != nil {
		http.Error(w, "获取分类文章失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": articles,
		"msg":  "获取成功",
	})
}

// GetArticlesByTagHandler 根据标签ID获取文章
func GetArticlesByTagHandler(w http.ResponseWriter, r *http.Request) {
	tagID := r.URL.Query().Get("tagId")
	if tagID == "" {
		http.Error(w, "标签ID不能为空", http.StatusBadRequest)
		return
	}

	// 获取分页参数
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	page := 1
	limit := 10

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	offset := (page - 1) * limit

	// 根据标签ID获取文章
	articles, err := models.GetArticlesByTagID(tagID, limit, offset)
	if err != nil {
		http.Error(w, "获取标签文章失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"code": 200,
		"data": articles,
		"msg":  "获取成功",
	})
}