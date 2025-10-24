// @title 博客系统 API接口文档
// @version 1.0
// @description 这是一个博客系统的 API 文档
// @host localhost:8083
// @BasePath /api
package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
	"github.com/jayden/personal-blog-backend/api"
	v1 "github.com/jayden/personal-blog-backend/api/v1"
	"github.com/jayden/personal-blog-backend/config"
	"github.com/jayden/personal-blog-backend/db"
	_ "github.com/jayden/personal-blog-backend/docs" // 这里需要导入 docs 包
	httpSwagger "github.com/swaggo/http-swagger"
)

// 自定义CORS中间件 - 详细日志版本
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 详细记录请求信息用于调试
		origin := r.Header.Get("Origin")
		log.Printf("收到请求: %s %s", r.Method, r.URL)
		log.Printf("请求来源: %s", origin)
		log.Printf("请求头: %v", r.Header)

		// 明确设置允许的源
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

		// 设置其他必要的CORS头
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400")
		w.Header().Set("Vary", "Origin")

		// 处理预检请求
		if r.Method == "OPTIONS" {
			log.Printf("处理预检请求: %s", r.URL)
			log.Printf("预检请求返回的CORS头: %v", w.Header())
			// 预检请求只返回头信息，不处理实际业务逻辑
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// 继续处理请求
		next.ServeHTTP(w, r)
	})
}

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
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
	apiRouter := r.PathPrefix("/blog-api/v1").Subrouter()
	apiRouter.HandleFunc("/login", api.LoginHandler).Methods("POST")
	apiRouter.HandleFunc("/register", api.RegisterHandler).Methods("POST")
	apiRouter.HandleFunc("/health", api.HealthCheck).Methods("GET")

	// 文章相关路由
	apiRouter.HandleFunc("/articles", api.GetArticlesHandler).Methods("GET")
	apiRouter.HandleFunc("/article", api.GetArticleDetailHandler).Methods("GET")
	apiRouter.HandleFunc("/article", api.CreateArticleHandler).Methods("POST")
	apiRouter.HandleFunc("/article", api.UpdateArticleHandler).Methods("PUT")
	apiRouter.HandleFunc("/article", api.DeleteArticleHandler).Methods("DELETE")

	// 分类相关路由
	apiRouter.HandleFunc("/categories", api.GetCategoriesHandler).Methods("GET")

	// 标签相关路由
	apiRouter.HandleFunc("/tags", api.GetTagsHandler).Methods("GET")

	// 分类和标签文章路由
	apiRouter.HandleFunc("/articles/category", api.GetArticlesByCategoryHandler).Methods("GET")
	apiRouter.HandleFunc("/articles/tag", api.GetArticlesByTagHandler).Methods("GET")

	// v1 API路由
	v1Router := r.PathPrefix("/blog-api/v1").Subrouter()

	// 相册相关路由
	v1Router.HandleFunc("/album/find_album_list", v1.FindAlbumListHandler).Methods("POST")
	v1Router.HandleFunc("/album/find_photo_list", v1.FindPhotoListHandler).Methods("POST")
	v1Router.HandleFunc("/album/get_album", v1.GetAlbumHandler).Methods("POST")

	// 文章相关路由
	v1Router.HandleFunc("/article/get_article_archives", v1.GetArticleArchivesHandler).Methods("POST")
	v1Router.HandleFunc("/article/get_article_classify_category", v1.GetArticleClassifyCategoryHandler).Methods("POST")
	v1Router.HandleFunc("/article/get_article_classify_tag", v1.GetArticleClassifyTagHandler).Methods("POST")
	v1Router.HandleFunc("/article/get_article_details", v1.GetArticleDetailsHandler).Methods("POST")
	v1Router.HandleFunc("/article/get_article_home_list", v1.GetArticleHomeListHandler).Methods("POST")
	v1Router.HandleFunc("/article/get_article_recommend", v1.GetArticleRecommendHandler).Methods("POST")
	v1Router.HandleFunc("/article/like_article", v1.LikeArticleHandler).Methods("POST")

	// 评论相关路由
	v1Router.HandleFunc("/comment/find_comment_list", v1.FindCommentListHandler).Methods("POST")
	v1Router.HandleFunc("/comment/find_comment_recent_list", v1.FindCommentRecentListHandler).Methods("POST")
	v1Router.HandleFunc("/comment/find_comment_reply_list", v1.FindCommentReplyListHandler).Methods("POST")
	v1Router.HandleFunc("/comment/add_comment", v1.AddCommentHandler).Methods("POST")
	v1Router.HandleFunc("/comment/like_comment", v1.LikeCommentHandler).Methods("POST")
	v1Router.HandleFunc("/comment/update_comment", v1.UpdateCommentHandler).Methods("POST")

	// 用户相关路由
	v1Router.HandleFunc("/user/delete_user_bind_third_party", v1.DeleteUserBindThirdPartyHandler).Methods("POST")
	v1Router.HandleFunc("/user/get_user_info", v1.GetUserInfoHandler).Methods("GET")
	v1Router.HandleFunc("/user/get_user_like", v1.GetUserLikeHandler).Methods("GET")
	v1Router.HandleFunc("/user/update_user_avatar", v1.UpdateUserAvatarHandler).Methods("POST")
	v1Router.HandleFunc("/user/update_user_bind_email", v1.UpdateUserBindEmailHandler).Methods("POST")
	v1Router.HandleFunc("/user/update_user_bind_phone", v1.UpdateUserBindPhoneHandler).Methods("POST")
	v1Router.HandleFunc("/user/update_user_bind_third_party", v1.UpdateUserBindThirdPartyHandler).Methods("POST")
	v1Router.HandleFunc("/user/update_user_info", v1.UpdateUserInfoHandler).Methods("POST")
	v1Router.HandleFunc("/user/update_user_password", v1.UpdateUserPasswordHandler).Methods("POST")

	// 博客相关路由
	v1Router.HandleFunc("/blog", v1.GetBlogHomeInfoHandler).Methods("GET")
	v1Router.HandleFunc("/blog/about_me", v1.GetAboutMeHandler).Methods("GET")

	// 游客相关路由
	v1Router.HandleFunc("/get_tourist_info", v1.GetTouristInfoHandler).Methods("GET")

	// 说说相关路由
	v1Router.HandleFunc("/talk/find_talk_list", v1.FindTalkListHandler).Methods("POST")

	// Swagger 文档路由
	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// 应用自定义CORS中间件
	handler := enableCORS(r)

	// 启动服务器
	server := &http.Server{
		Addr:    ":8083",
		Handler: handler,
	}

	// 启动服务器在后台
	go func() {
		log.Println("Server starting on :8083")
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
