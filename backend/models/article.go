package models

import (
	"time"
)

// Article 文章模型
type Article struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"article_title" db:"article_title"`
	Content     string    `json:"article_content" db:"article_content"`
	Cover       string    `json:"article_cover" db:"article_cover"`
	Type        int       `json:"article_type" db:"article_type"`
	OriginalUrl string    `json:"original_url" db:"original_url"`
	IsTop       int       `json:"is_top" db:"is_top"`
	Status      int       `json:"status" db:"status"`
	CategoryID  string    `json:"category_id" db:"category_id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// ArticleDetails 文章详情模型
type ArticleDetails struct {
	Article
	Author               *UserInfo        `json:"author"`
	LastArticle          *ArticlePreview  `json:"last_article"`
	NextArticle          *ArticlePreview  `json:"next_article"`
	RecommendArticleList []ArticlePreview `json:"recommend_article_list"`
	NewestArticleList    []ArticlePreview `json:"newest_article_list"`
}

// ArticlePreview 文章预览模型
type ArticlePreview struct {
	ID           string    `json:"id" db:"id"`
	ArticleCover string    `json:"article_cover" db:"article_cover"`
	ArticleTitle string    `json:"article_title" db:"article_title"`
	LikeCount    int       `json:"like_count" db:"like_count"`
	ViewsCount   int       `json:"views_count" db:"views_count"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// ArticleArchive 文章归档模型
type ArticleArchive struct {
	ID           string    `json:"id" db:"id"`
	ArticleTitle string    `json:"article_title" db:"article_title"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// GetArticles 获取文章列表
func GetArticles(limit, offset int) ([]Article, error) {
	// 实现获取文章列表逻辑
	return []Article{}, nil
}

// GetArticleByID 根据ID获取文章
func GetArticleByID(id string) (*Article, error) {
	// 实现根据ID获取文章逻辑
	return &Article{}, nil
}

// CreateArticle 创建文章
func CreateArticle(article *Article) error {
	// 实现创建文章逻辑
	return nil
}

// UpdateArticle 更新文章
func UpdateArticle(article *Article) error {
	// 实现更新文章逻辑
	return nil
}

// DeleteArticle 删除文章
func DeleteArticle(id string) error {
	// 实现删除文章逻辑
	return nil
}

// GetArticlesByCategoryID 根据分类ID获取文章
func GetArticlesByCategoryID(categoryID string, limit, offset int) ([]Article, error) {
	// 实现根据分类ID获取文章逻辑
	return []Article{}, nil
}

// GetArticlesByTagID 根据标签ID获取文章
func GetArticlesByTagID(tagID string, limit, offset int) ([]Article, error) {
	// 实现根据标签ID获取文章逻辑
	return []Article{}, nil
}

// GetArticleCount 获取文章总数
func GetArticleCount() (int64, error) {
	// 实现获取文章总数逻辑
	return 0, nil
}
