package models

import (
	"database/sql"
	"fmt"

	"github.com/jayden/personal-blog-backend/db"
)

// Category 分类模型
// @Description 文章分类信息
type Category struct {
	// 分类ID
	ID string `json:"id" example:"1"`
	// 分类名称
	Name string `json:"name" example:"技术"`
	// 文章数量
	Count int `json:"count" example:"10"`
}

// GetCategories 获取所有分类
func GetCategories() ([]*Category, error) {
	rows, err := db.DB.Query("SELECT id, name, count FROM 分类表 ORDER BY count DESC")
	if err != nil {
		return nil, fmt.Errorf("获取分类列表失败: %w", err)
	}
	defer rows.Close()

	var categories []*Category
	for rows.Next() {
		category := &Category{}
		scanErr := rows.Scan(&category.ID, &category.Name, &category.Count)
		if scanErr != nil {
			return nil, fmt.Errorf("扫描分类行失败: %w", scanErr)
		}
		categories = append(categories, category)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("遍历分类行失败: %w", err)
	}

	return categories, nil
}

// GetCategoryByID 根据ID获取分类
func GetCategoryByID(id string) (*Category, error) {
	category := &Category{}
	err := db.DB.QueryRow("SELECT id, name, count FROM 分类表 WHERE id = ?", id).Scan(&category.ID, &category.Name, &category.Count)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("获取分类失败: %w", err)
	}
	return category, nil
}

// GetCategoryByName 根据名称获取分类
func GetCategoryByName(name string) (*Category, error) {
	category := &Category{}
	err := db.DB.QueryRow("SELECT id, name, count FROM 分类表 WHERE name = ?", name).Scan(&category.ID, &category.Name, &category.Count)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("获取分类失败: %w", err)
	}
	return category, nil
}

// CreateCategory 创建新分类
func CreateCategory(category *Category) error {
	_, err := db.DB.Exec("INSERT INTO 分类表 (id, name, count) VALUES (?, ?, ?)", category.ID, category.Name, category.Count)
	if err != nil {
		return fmt.Errorf("创建分类失败: %w", err)
	}
	return nil
}

// UpdateCategory 更新分类
func UpdateCategory(category *Category) error {
	_, err := db.DB.Exec("UPDATE 分类表 SET name = ?, count = ? WHERE id = ?", category.Name, category.Count, category.ID)
	if err != nil {
		return fmt.Errorf("更新分类失败: %w", err)
	}
	return nil
}

// DeleteCategory 删除分类
func DeleteCategory(id string) error {
	_, err := db.DB.Exec("DELETE FROM 分类表 WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("删除分类失败: %w", err)
	}
	return nil
}
