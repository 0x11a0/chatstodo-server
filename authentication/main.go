package main

import (
	"database/sql"
	"log"
	"net/http"
	"net/mail"
	"os"

	cmd "chatstodo/authentication/cmd"
	utils "chatstodo/authentication/internal/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var (
	jwtKey []byte
	db *sql.DB
	postgresqlAddress string
)

func main() {
	godotenv.Load("../.env")
	postgresqlAddress = os.Getenv("USER_POSTGRESQL_URL")
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")

	var err error
	jwtKey = []byte(jwtSecretKey)

	cmd.Execute(postgresqlAddress)

    // Connect to PostgreSQL
    connStr := postgresqlAddress
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }

    if err = db.Ping(); err != nil {
        log.Fatal(err)
    }

    // Initialize Gin
    r := gin.Default()

	authGroup := r.Group("/auth/api/v1")
	{
		// ping health including db
		authGroup.GET("/health", func(c *gin.Context) {

			err = db.PingContext(c)
			if err != nil {
				c.JSON(http.StatusFailedDependency, gin.H{"error": "Service temporarily unavailable"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message":"Service is running"})
		})

		// OAuth callback endpoint
		authGroup.POST("/oauth/google/callback", handleOAuthCallback)
	}

    r.Run(":8080")
}

func handleOAuthCallback(c *gin.Context) {
	var requestBody struct {
		Email     string `json:"email"`
	}

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

    tx, err := db.BeginTx(c, nil)
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
			err = db.QueryRow("INSERT INTO users(id, email) VALUES($1, $2) RETURNING id", newUUID, requestBody.Email).Scan(&userId)
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
