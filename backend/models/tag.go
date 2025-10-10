package models

import (
	"database/sql"
	"fmt"

	"github.com/jayden/personal-blog-backend/db"
)

// Tag 标签模型
// @Description 文章标签信息
type Tag struct {
	// 标签ID
	ID string `json:"id" example:"1"`
	// 标签名称
	Name string `json:"name" example:"Go"`
	// 文章数量
	Count int `json:"count" example:"5"`
}

// GetTags 获取所有标签
func GetTags() ([]*Tag, error) {
	rows, err := db.DB.Query("SELECT id, name, count FROM 标签表 ORDER BY count DESC")
	if err != nil {
		return nil, fmt.Errorf("获取标签列表失败: %w", err)
	}
	defer rows.Close()

	var tags []*Tag
	for rows.Next() {
		tag := &Tag{}
		err := rows.Scan(&tag.ID, &tag.Name, &tag.Count)
		if err != nil {
			return nil, fmt.Errorf("扫描标签行失败: %w", err)
		}
		tags = append(tags, tag)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历标签行失败: %w", err)
	}

	return tags, nil
}

// GetTagByID 根据ID获取标签
func GetTagByID(id string) (*Tag, error) {
	tag := &Tag{}
	err := db.DB.QueryRow("SELECT id, name, count FROM 标签表 WHERE id = ?", id).Scan(&tag.ID, &tag.Name, &tag.Count)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("获取标签失败: %w", err)
	}
	return tag, nil
}

// GetTagByName 根据名称获取标签
func GetTagByName(name string) (*Tag, error) {
	tag := &Tag{}
	err := db.DB.QueryRow("SELECT id, name, count FROM 标签表 WHERE name = ?", name).Scan(&tag.ID, &tag.Name, &tag.Count)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("获取标签失败: %w", err)
	}
	return tag, nil
}

// GetTagsByArticleID 根据文章ID获取所有标签
func GetTagsByArticleID(articleID string) ([]*Tag, error) {
	rows, err := db.DB.Query(
		"SELECT t.id, t.name, t.count FROM 标签表 t JOIN 文章标签关联表 at ON t.id = at.tag_id WHERE at.article_id = ?",
		articleID,
	)
	if err != nil {
		return nil, fmt.Errorf("获取文章标签失败: %w", err)
	}
	defer rows.Close()

	var tags []*Tag
	for rows.Next() {
		tag := &Tag{}
		err := rows.Scan(&tag.ID, &tag.Name, &tag.Count)
		if err != nil {
			return nil, fmt.Errorf("扫描文章标签行失败: %w", err)
		}
		tags = append(tags, tag)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历文章标签行失败: %w", err)
	}

	return tags, nil
}

// CreateTag 创建新标签
func CreateTag(tag *Tag) error {
	_, err := db.DB.Exec("INSERT INTO 标签表 (id, name, count) VALUES (?, ?, ?)", tag.ID, tag.Name, tag.Count)
	if err != nil {
		return fmt.Errorf("创建标签失败: %w", err)
	}
	return nil
}

// UpdateTag 更新标签
func UpdateTag(tag *Tag) error {
	_, err := db.DB.Exec("UPDATE 标签表 SET name = ?, count = ? WHERE id = ?", tag.Name, tag.Count, tag.ID)
	if err != nil {
		return fmt.Errorf("更新标签失败: %w", err)
	}
	return nil
}

// DeleteTag 删除标签
func DeleteTag(id string) error {
	_, err := db.DB.Exec("DELETE FROM 标签表 WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("删除标签失败: %w", err)
	}
	return nil
}
