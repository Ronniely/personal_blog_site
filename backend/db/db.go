package db

import (
	"database/sql"
	"fmt"
	"github.com/jayden/personal-blog-backend/config"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"time"
)

var DB *sql.DB

// InitDB 初始化数据库连接
func InitDB(config *config.Config) error {
	// 构建连接字符串
	connStr := config.GetDBConnectionString()

	// 打开数据库连接
	var err error
	DB, err = sql.Open("mysql", connStr)
	if err != nil {
		return fmt.Errorf("无法打开数据库连接: %w", err)
	}

	// 设置连接池参数
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)
	DB.SetConnMaxIdleTime(5 * time.Minute)

	// 测试连接
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("无法连接到数据库: %w", err)
	}

	log.Println("成功连接到数据库")
	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}