package models

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/jayden/personal-blog-backend/db"
)

// Article 文章模型
// @Description 文章信息
type Article struct {
	// 文章ID
	ID string `json:"id" example:"1"`
	// 文章标题
	Title string `json:"title" example:"文章标题"`
	// 文章内容
	Content string `json:"content" example:"文章内容..."`
	// 文章摘要
	Excerpt string `json:"excerpt" example:"文章摘要..."`
	// 封面图片URL
	CoverImage string `json:"coverImage" example:"https://example.com/image.jpg"`
	// 分类ID
	CategoryID string `json:"categoryId" example:"1"`
	// 创建时间
	CreatedAt time.Time `json:"createdAt" example:"2023-01-01T00:00:00Z"`
	// 更新时间
	UpdatedAt time.Time `json:"updatedAt" example:"2023-01-01T00:00:00Z"`
	// 浏览量
	Views int `json:"views" example:"100"`
	// 点赞数
	Likes int `json:"likes" example:"10"`
	// 作者ID
	AuthorID string `json:"authorId" example:"1"`
	// 是否发布
	Published bool `json:"published" example:"true"`
	// 分类信息
	Category *Category `json:"category"`
	// 标签列表
	Tags []*Tag `json:"tags"`
}

// CreateArticle 创建新文章
func CreateArticle(article *Article) error {
	tx, err := db.DB.Begin()
	if err != nil {
		return fmt.Errorf("开始事务失败: %w", err)
	}
	defer tx.Rollback()

	// 插入文章基本信息
	_, err = tx.Exec(
		"INSERT INTO article (id, title, content, excerpt, cover_image, category_id, created_at, updated_at, views, likes, author_id, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		article.ID, article.Title, article.Content, article.Excerpt, article.CoverImage, article.CategoryID, article.CreatedAt, article.UpdatedAt, article.Views, article.Likes, article.AuthorID, article.Published,
	)
	if err != nil {
		return fmt.Errorf("插入文章信息失败: %w", err)
	}

	// 如果有标签，创建文章与标签的关联
	if len(article.Tags) > 0 {
		for _, tag := range article.Tags {
			_, err = tx.Exec("INSERT INTO relevance (article_id, tag_id) VALUES (?, ?)", article.ID, tag.ID)
			if err != nil {
				return fmt.Errorf("创建文章标签关联失败: %w", err)
			}

			// 更新标签计数
			tag.Count++
			_, err = tx.Exec("UPDATE tag SET count = ? WHERE id = ?", tag.Count, tag.ID)
			if err != nil {
				return fmt.Errorf("更新标签计数失败: %w", err)
			}
		}
	}

	// 更新分类计数
	category, err := GetCategoryByID(article.CategoryID)
	if err != nil {
		return fmt.Errorf("获取分类失败: %w", err)
	}
	if category != nil {
		category.Count++
		_, err = tx.Exec("UPDATE category SET count = ? WHERE id = ?", category.Count, category.ID)
		if err != nil {
			return fmt.Errorf("更新分类计数失败: %w", err)
		}
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("提交事务失败: %w", err)
	}

	return nil
}

// GetArticleByID 根据ID获取文章
func GetArticleByID(id string) (*Article, error) {
	article := &Article{}

	// 查询文章基本信息
	err := db.DB.QueryRow(
		"SELECT id, title, content, excerpt, cover_image, category_id, created_at, updated_at, views, likes, author_id, published FROM article WHERE id = ?",
		id,
	).Scan(
		&article.ID, &article.Title, &article.Content, &article.Excerpt, &article.CoverImage, &article.CategoryID, &article.CreatedAt, &article.UpdatedAt, &article.Views, &article.Likes, &article.AuthorID, &article.Published,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("获取文章失败: %w", err)
	}

	// 获取文章分类
	category, err := GetCategoryByID(article.CategoryID)
	if err != nil {
		return nil, fmt.Errorf("获取文章分类失败: %w", err)
	}
	article.Category = category

	// 获取文章标签
	tags, err := GetTagsByArticleID(id)
	if err != nil {
		return nil, fmt.Errorf("获取文章标签失败: %w", err)
	}
	article.Tags = tags

	return article, nil
}

// UpdateArticle 更新文章
func UpdateArticle(article *Article) error {
	tx, err := db.DB.Begin()
	if err != nil {
		return fmt.Errorf("开始事务失败: %w", err)
	}
	defer tx.Rollback()

	// 获取旧文章信息
	oldArticle, err := GetArticleByID(article.ID)
	if err != nil {
		return fmt.Errorf("获取旧文章信息失败: %w", err)
	}

	// 更新文章基本信息
	_, err = tx.Exec(
		"UPDATE article SET title = ?, content = ?, excerpt = ?, cover_image = ?, category_id = ?, updated_at = ?, views = ?, likes = ?, author_id = ?, published = ? WHERE id = ?",
		article.Title, article.Content, article.Excerpt, article.CoverImage, article.CategoryID, article.UpdatedAt, article.Views, article.Likes, article.AuthorID, article.Published, article.ID,
	)
	if err != nil {
		return fmt.Errorf("更新文章失败: %w", err)
	}

	// 如果分类变更，更新分类计数
	if oldArticle.CategoryID != article.CategoryID {
		// 减少旧分类计数
		_, err = tx.Exec("UPDATE category SET count = count - 1 WHERE id = ?", oldArticle.CategoryID)
		if err != nil {
			return fmt.Errorf("更新旧分类计数失败: %w", err)
		}

		// 增加新分类计数
		_, err = tx.Exec("UPDATE category SET count = count + 1 WHERE id = ?", article.CategoryID)
		if err != nil {
			return fmt.Errorf("更新新分类计数失败: %w", err)
		}
	}

	// 删除旧标签关联
	_, err = tx.Exec("DELETE FROM relevance WHERE article_id = ?", article.ID)
	if err != nil {
		return fmt.Errorf("删除旧标签关联失败: %w", err)
	}

	// 减少旧标签计数
	for _, oldTag := range oldArticle.Tags {
		_, err = tx.Exec("UPDATE tag SET count = count - 1 WHERE id = ?", oldTag.ID)
		if err != nil {
			return fmt.Errorf("更新旧标签计数失败: %w", err)
		}
	}

	// 处理新标签关联
	for _, newTag := range article.Tags {
		_, err = tx.Exec("INSERT INTO relevance (article_id, tag_id) VALUES (?, ?)", article.ID, newTag.ID)
		if err != nil {
			return fmt.Errorf("添加新标签关联失败: %w", err)
		}

		// 增加新标签计数
		_, err = tx.Exec("UPDATE tag SET count = count + 1 WHERE id = ?", newTag.ID)
		if err != nil {
			return fmt.Errorf("更新新标签计数失败: %w", err)
		}
	}

	return tx.Commit()
}

// DeleteArticle 删除文章
func DeleteArticle(id string) error {
	tx, err := db.DB.Begin()
	if err != nil {
		return fmt.Errorf("开始事务失败: %w", err)
	}
	defer tx.Rollback()

	// 获取文章信息
	article, err := GetArticleByID(id)
	if err != nil {
		return fmt.Errorf("获取文章信息失败: %w", err)
	}

	// 删除文章
	_, err = tx.Exec("DELETE FROM article WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("删除文章失败: %w", err)
	}

	// 删除标签关联
	_, err = tx.Exec("DELETE FROM relevance WHERE article_id = ?", id)
	if err != nil {
		return fmt.Errorf("删除标签关联失败: %w", err)
	}

	// 更新分类计数
	_, err = tx.Exec("UPDATE category SET count = count - 1 WHERE id = ?", article.CategoryID)
	if err != nil {
		return fmt.Errorf("更新分类计数失败: %w", err)
	}

	// 更新标签计数
	for _, tag := range article.Tags {
		_, err = tx.Exec("UPDATE tag SET count = count - 1 WHERE id = ?", tag.ID)
		if err != nil {
			return fmt.Errorf("更新标签计数失败: %w", err)
		}
	}

	return tx.Commit()
}

// GetArticles 获取文章列表
func GetArticles(limit, offset int) ([]*Article, error) {
	rows, err := db.DB.Query(
		"SELECT id, title, content, excerpt, cover_image, category_id, created_at, updated_at, views, likes, author_id, published FROM article WHERE published = true ORDER BY created_at DESC LIMIT ? OFFSET ?",
		limit, offset,
	)
	if err != nil {
		return nil, fmt.Errorf("获取文章列表失败: %w", err)
	}
	defer rows.Close()

	var articles []*Article
	for rows.Next() {
		article := &Article{}
		scanErr := rows.Scan(
			&article.ID, &article.Title, &article.Content, &article.Excerpt, &article.CoverImage, &article.CategoryID, &article.CreatedAt, &article.UpdatedAt, &article.Views, &article.Likes, &article.AuthorID, &article.Published,
		)
		if scanErr != nil {
			return nil, fmt.Errorf("扫描文章行失败: %w", scanErr)
		}

		// 获取分类信息
		category, err := GetCategoryByID(article.CategoryID)
		if err != nil {
			return nil, fmt.Errorf("获取文章分类失败: %w", err)
		}
		article.Category = category

		// 获取标签信息
		tags, err := GetTagsByArticleID(article.ID)
		if err != nil {
			return nil, fmt.Errorf("获取文章标签失败: %w", err)
		}
		article.Tags = tags

		articles = append(articles, article)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历文章行失败: %w", err)
	}

	return articles, nil
}

// GetArticlesByCategoryID 根据分类ID获取文章
func GetArticlesByCategoryID(categoryID string, limit, offset int) ([]*Article, error) {
	rows, err := db.DB.Query(
		"SELECT id, title, content, excerpt, cover_image, category_id, created_at, updated_at, views, likes, author_id, published FROM article WHERE category_id = ? AND published = true ORDER BY created_at DESC LIMIT ? OFFSET ?",
		categoryID, limit, offset,
	)
	if err != nil {
		return nil, fmt.Errorf("获取分类文章失败: %w", err)
	}
	defer rows.Close()

	var articles []*Article
	for rows.Next() {
		article := &Article{}
		scanErr := rows.Scan(
			&article.ID, &article.Title, &article.Content, &article.Excerpt, &article.CoverImage, &article.CategoryID, &article.CreatedAt, &article.UpdatedAt, &article.Views, &article.Likes, &article.AuthorID, &article.Published,
		)
		if scanErr != nil {
			return nil, fmt.Errorf("扫描分类文章行失败: %w", scanErr)
		}

		// 获取分类信息
		category, err := GetCategoryByID(article.CategoryID)
		if err != nil {
			return nil, fmt.Errorf("获取分类信息失败: %w", err)
		}
		article.Category = category

		// 获取标签信息
		tags, err := GetTagsByArticleID(article.ID)
		if err != nil {
			return nil, fmt.Errorf("获取标签信息失败: %w", err)
		}
		article.Tags = tags

		articles = append(articles, article)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历分类文章行失败: %w", err)
	}

	return articles, nil
}

// GetArticlesByTagID 根据标签ID获取文章
func GetArticlesByTagID(tagID string, limit, offset int) ([]*Article, error) {
	rows, err := db.DB.Query(
		"SELECT a.id, a.title, a.content, a.excerpt, a.cover_image, a.category_id, a.created_at, a.updated_at, a.views, a.likes, a.author_id, a.published FROM article a JOIN relevance at ON a.id = at.article_id WHERE at.tag_id = ? AND a.published = true ORDER BY a.created_at DESC LIMIT ? OFFSET ?",
		tagID, limit, offset,
	)
	if err != nil {
		return nil, fmt.Errorf("获取标签文章失败: %w", err)
	}
	defer rows.Close()

	var articles []*Article
	for rows.Next() {
		article := &Article{}
		scanErr := rows.Scan(
			&article.ID, &article.Title, &article.Content, &article.Excerpt, &article.CoverImage, &article.CategoryID, &article.CreatedAt, &article.UpdatedAt, &article.Views, &article.Likes, &article.AuthorID, &article.Published,
		)
		if scanErr != nil {
			return nil, fmt.Errorf("扫描标签文章行失败: %w", scanErr)
		}

		// 获取分类信息
		category, err := GetCategoryByID(article.CategoryID)
		if err != nil {
			return nil, fmt.Errorf("获取分类信息失败: %w", err)
		}
		article.Category = category

		// 获取标签信息
		tags, err := GetTagsByArticleID(article.ID)
		if err != nil {
			return nil, fmt.Errorf("获取标签信息失败: %w", err)
		}
		article.Tags = tags

		articles = append(articles, article)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历标签文章行失败: %w", err)
	}

	return articles, nil
}
