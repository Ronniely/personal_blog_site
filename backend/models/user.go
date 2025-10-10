package models

import (
	"database/sql"
	"time"

	"github.com/jayden/personal-blog-backend/db"
	"golang.org/x/crypto/bcrypt"
)

// User 用户模型
// @Description 用户信息
type User struct {
	// 用户ID
	ID int `json:"id" example:"1"`
	// 用户名
	Username string `json:"username" example:"admin"`
	// 密码（在序列化时忽略）
	Password string `json:"password,omitempty"` // omitempty 表示在序列化时，如果值为空则忽略该字段
	// 邮箱
	Email string `json:"email" example:"admin@example.com"`
	// 创建时间
	CreatedTime time.Time `json:"created_time" example:"2023-01-01T00:00:00Z"`
}

// CreateUser 创建新用户
func CreateUser(username, password, email string) (*User, error) {
	// 对密码进行哈希处理
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// 插入用户数据
	result, err := db.DB.Exec(
		"INSERT INTO 用户表 (username, password, email, created_time) VALUES (?, ?, ?, NOW())",
		username, string(hashedPassword), email,
	)
	if err != nil {
		return nil, err
	}

	// 获取插入的用户ID
	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	// 返回新创建的用户
	return &User{
		ID:          int(id),
		Username:    username,
		Email:       email,
		CreatedTime: time.Now(),
	}, nil
}

// GetUserByUsername 根据用户名查找用户
func GetUserByUsername(username string) (*User, error) {
	var user User
	row := db.DB.QueryRow("SELECT id, username, password, email, created_time FROM 用户表 WHERE username = ?", username)
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email, &user.CreatedTime)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // 用户不存在
		}
		return nil, err
	}
	return &user, nil
}

// GetUserByEmail 根据邮箱查找用户
func GetUserByEmail(email string) (*User, error) {
	var user User
	row := db.DB.QueryRow("SELECT id, username, password, email, created_time FROM 用户表 WHERE email = ?", email)
	err := row.Scan(&user.ID, &user.Username, &user.Password, &user.Email, &user.CreatedTime)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // 用户不存在
		}
		return nil, err
	}
	return &user, nil
}

// VerifyPassword 验证密码是否正确
func VerifyPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
