package cmd

import (
	"chatstodo/authentication/internal/utils"
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

func ExecuteAPIServer(databaseConnection *sql.DB, redisClient *redis.Client, jwtKey []byte) {	
    // Initialize Gin
    r := gin.Default()

	authGroup := r.Group("/auth/api/v1")
	{
		// ping health including db and redis
		authGroup.GET("/health", healthHandler(databaseConnection, redisClient))

		authGroup.POST("/bot/connect", botConnectHandler(redisClient))

		// OAuth callback endpoint
		authGroup.POST("/oauth/google/callback", OAuthCallbackHandler(databaseConnection, jwtKey))
	}

    if err := r.Run(":8080"); err != nil {
        log.Fatal("Failed to run server: ", err)
    }
}


func healthHandler(dbConnection *sql.DB, redisClient *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := dbConnection.PingContext(c); err != nil {
			c.JSON(http.StatusFailedDependency, gin.H{"error": "Service temporarily unavailable"})
			return
		}
		if err := redisClient.Ping(c).Err(); err != nil {
			c.JSON(http.StatusFailedDependency, gin.H{"error": "Service temporarily unavailable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Service is running"})
	}
}


func botConnectHandler(redisClient *redis.Client) gin.HandlerFunc {
	var requestBody struct {
		UserId     string `json:"userId"`
	}

	return func(c *gin.Context) {

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request"})
			return
		}

		if requestBody.UserId == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
			return
		}

		code := generateAuthCode()

		ctx := context.Background()
		err := storeUserIDAndAuthCodeMapping(ctx, redisClient, requestBody.UserId, code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error storing user verification code"})
			log.Printf("%v",err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"verification_code": code})
	}
}

func storeUserIDAndAuthCodeMapping(ctx context.Context, redisClient *redis.Client, userId string, code string) error {
	expiration := 10 * time.Minute
	return redisClient.Set(ctx, fmt.Sprintf("user_verification:%s", userId), code, expiration).Err()
}

func generateAuthCode() string {
	b := make([]byte, 6)
    if _, err := rand.Read(b); err != nil {
        return ""
    }
    return hex.EncodeToString(b)
}

func OAuthCallbackHandler(databaseConnection *sql.DB, jwtKey []byte) gin.HandlerFunc {
	var requestBody struct {
		Email     string `json:"email"`
	}

	return func(c *gin.Context) {

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON request"})
			log.Printf("%v",err)
			return
		}

		// Validate email address
		_, err := mail.ParseAddress(requestBody.Email)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
			log.Printf("%v", err)
			return
		}

		tx, err := databaseConnection.BeginTx(c, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction start error"})
			log.Printf("%v", err)
			return
		}

		var userId string
		if err := tx.QueryRow("SELECT id FROM users WHERE email = $1", requestBody.Email).Scan(&userId); err != nil {
			if err == sql.ErrNoRows {
				// User doesn't exist, insert new record
				newUUID := uuid.New().String()
				err = databaseConnection.QueryRow("INSERT INTO users(id, email) VALUES($1, $2) RETURNING id", newUUID, requestBody.Email).Scan(&userId)
				if err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
					log.Printf("%v",err)
					return
				}
			} else {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
				log.Printf("%v",err)
				return
			}
		}

		if err := tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction commit error"})
			log.Printf("%v", err)
			return
		}

		// Generate JWT
		tokenString, err := utils.GenerateJWT(userId, requestBody.Email, jwtKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
			log.Printf("%v",err)
			return
		}

		// Send the token back to the user
		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	}
}
