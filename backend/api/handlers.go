package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jayden/personal-blog-backend/models"
)

// 登录请求结构体
// @Description 用户登录请求参数
type LoginRequest struct {
	// 用户名
	Username string `json:"username" example:"admin"`
	// 密码
	Password string `json:"password" example:"password123"`
}

// 登录响应结构体
// @Description 用户登录响应结果
type LoginResponse struct {
	// JWT Token
	Token string `json:"token" example:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`
	// 响应消息
	Message string `json:"message" example:"登录成功"`
}

// 注册请求结构体
// @Description 用户注册请求参数
type RegisterRequest struct {
	// 用户名
	Username string `json:"username" example:"newuser"`
	// 密码
	Password string `json:"password" example:"newpassword123"`
	// 邮箱
	Email string `json:"email" example:"newuser@example.com"`
}

// 注册响应结构体
// @Description 用户注册响应结果
type RegisterResponse struct {
	// 响应消息
	Message string `json:"message" example:"注册成功"`
	// 是否成功
	Success bool `json:"success" example:"true"`
}

// JWT密钥（在实际应用中应该从环境变量读取）
var jwtKey = []byte("my_secret_key")

// Claims JWT声明结构体
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// @Summary 用户登录
// @Description 用户登录接口，成功后返回JWT Token
// @Tags 用户认证
// @Accept  json
// @Produce  json
// @Param loginReq body LoginRequest true "登录请求参数"
// @Success 200 {object} LoginResponse "登录成功"
// @Failure 400 {object} map[string]string "无效的请求体"
// @Failure 401 {object} map[string]string "用户名或密码错误"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /login [post]
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

// @Summary 健康检查
// @Description 检查服务器是否正常运行
// @Tags 系统
// @Produce  json
// @Success 200 {object} map[string]string "服务器正常"
// @Router /health [get]
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// @Summary 用户注册
// @Description 用户注册接口
// @Tags 用户认证
// @Accept  json
// @Produce  json
// @Param registerReq body RegisterRequest true "注册请求参数"
// @Success 201 {object} RegisterResponse "注册成功"
// @Failure 400 {object} RegisterResponse "用户名、密码和邮箱不能为空"
// @Failure 409 {object} RegisterResponse "用户名或邮箱已存在"
// @Failure 500 {object} RegisterResponse "服务器错误"
// @Router /register [post]
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

// @Summary 获取文章列表
// @Description 获取所有文章的列表，支持分页
// @Tags 文章
// @Produce  json
// @Param page query int false "页码" default(1)
// @Param limit query int false "每页数量" default(10)
// @Success 200 {object} map[string]interface{} "文章列表"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /articles [get]
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

// @Summary 获取文章详情
// @Description 根据文章ID获取文章详情
// @Tags 文章
// @Produce  json
// @Param id query string true "文章ID"
// @Success 200 {object} map[string]interface{} "文章详情"
// @Failure 400 {object} map[string]string "文章ID不能为空"
// @Failure 404 {object} map[string]string "文章不存在"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /article [get]
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

// @Summary 创建文章
// @Description 创建新文章
// @Tags 文章
// @Accept  json
// @Produce  json
// @Param article body models.Article true "文章信息"
// @Success 200 {object} map[string]interface{} "创建成功"
// @Failure 400 {object} map[string]string "标题、内容和分类不能为空"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /article [post]
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

// @Summary 更新文章
// @Description 更新文章信息
// @Tags 文章
// @Accept  json
// @Produce  json
// @Param article body models.Article true "文章信息"
// @Success 200 {object} map[string]interface{} "更新成功"
// @Failure 400 {object} map[string]string "ID、标题、内容和分类不能为空"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /article [put]
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

// @Summary 删除文章
// @Description 根据文章ID删除文章
// @Tags 文章
// @Produce  json
// @Param id query string true "文章ID"
// @Success 200 {object} map[string]interface{} "删除成功"
// @Failure 400 {object} map[string]string "文章ID不能为空"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /article [delete]
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

// @Summary 获取分类列表
// @Description 获取所有文章分类
// @Tags 分类
// @Produce  json
// @Success 200 {object} map[string]interface{} "分类列表"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /categories [get]
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

// @Summary 获取标签列表
// @Description 获取所有文章标签
// @Tags 标签
// @Produce  json
// @Success 200 {object} map[string]interface{} "标签列表"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /tags [get]
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

// @Summary 根据分类ID获取文章
// @Description 根据分类ID获取该分类下的文章列表，支持分页
// @Tags 文章
// @Produce  json
// @Param categoryId query string true "分类ID"
// @Param page query int false "页码" default(1)
// @Param limit query int false "每页数量" default(10)
// @Success 200 {object} map[string]interface{} "文章列表"
// @Failure 400 {object} map[string]string "分类ID不能为空"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /articles/category [get]
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

// @Summary 根据标签ID获取文章
// @Description 根据标签ID获取该标签下的文章列表，支持分页
// @Tags 文章
// @Produce  json
// @Param tagId query string true "标签ID"
// @Param page query int false "页码" default(1)
// @Param limit query int false "每页数量" default(10)
// @Success 200 {object} map[string]interface{} "文章列表"
// @Failure 400 {object} map[string]string "标签ID不能为空"
// @Failure 500 {object} map[string]string "服务器错误"
// @Router /articles/tag [get]
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
