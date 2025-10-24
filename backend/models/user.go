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

// UserInfo 用户信息模型
type UserInfo struct {
	UserID       string `json:"user_id" db:"user_id"`
	Username     string `json:"username" db:"username"`
	Nickname     string `json:"nickname" db:"nickname"`
	Avatar       string `json:"avatar" db:"avatar"`
	Email        string `json:"email" db:"email"`
	Phone        string `json:"phone" db:"phone"`
	RegisterType string `json:"register_type" db:"register_type"`
	CreatedAt    int64  `json:"created_at" db:"created_at"`
	// 扩展字段
	Gender  int    `json:"gender" db:"gender"`
	Intro   string `json:"intro" db:"intro"`
	Website string `json:"website" db:"website"`
}

// UserLike 用户点赞模型
type UserLike struct {
	ArticleLikeSet []int64 `json:"article_like_set"`
	CommentLikeSet []int64 `json:"comment_like_set"`
	TalkLikeSet    []int64 `json:"talk_like_set"`
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
		"INSERT INTO user (username, password, email, created_time) VALUES (?, ?, ?, NOW())",
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
	row := db.DB.QueryRow("SELECT id, username, password, email, created_time FROM user WHERE username = ?", username)
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
	row := db.DB.QueryRow("SELECT id, username, password, email, created_time FROM user WHERE email = ?", email)
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

// GetUserByID 根据ID获取用户信息
func GetUserByID(userID string) (*UserInfo, error) {
	// 实现根据ID获取用户信息逻辑
	return &UserInfo{}, nil
}

// UpdateUserAvatar 更新用户头像
func UpdateUserAvatar(userID, avatar string) error {
	// 实现更新用户头像逻辑
	return nil
}

// UpdateUserBindEmail 更新用户绑定邮箱
func UpdateUserBindEmail(userID, email string) error {
	// 实现更新用户绑定邮箱逻辑
	return nil
}

// UpdateUserBindPhone 更新用户绑定手机号
func UpdateUserBindPhone(userID, phone string) error {
	// 实现更新用户绑定手机号逻辑
	return nil
}

// UpdateUserBindThirdParty 更新用户绑定第三方平台账号
func UpdateUserBindThirdParty(userID, platform, openID, nickname, avatar string) error {
	// 实现更新用户绑定第三方平台账号逻辑
	return nil
}

// DeleteUserBindThirdParty 删除用户绑定第三方平台账号
func DeleteUserBindThirdParty(userID, platform string) error {
	// 实现删除用户绑定第三方平台账号逻辑
	return nil
}

// UpdateUserInfo 更新用户信息
func UpdateUserInfo(userID, nickname, intro, website string, gender int) error {
	// 实现更新用户信息逻辑
	return nil
}

// UpdateUserPassword 更新用户密码
func UpdateUserPassword(userID, newPassword string) error {
	// 实现更新用户密码逻辑
	return nil
}

// GetUserLike 获取用户点赞列表
func GetUserLike(userID string) (*UserLike, error) {
	// 实现获取用户点赞列表逻辑
	return &UserLike{}, nil
}
