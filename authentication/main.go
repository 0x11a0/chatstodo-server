package main

import (
	"database/sql"
	"log"
	"net/http"
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

// User structure
type User struct {
    ID    int
    Email string
}


func main() {
	var err error
	godotenv.Load("../.env")
	postgresqlAddress = os.Getenv("USER_POSTGRESQL_URL")

	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	jwtKey = []byte(jwtSecretKey)

	cmd.Execute(postgresqlAddress)

    // Connect to PostgreSQL
    connStr := postgresqlAddress
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }

    // Initialize Gin
    r := gin.Default()

	authGroup := r.Group("/auth")
	{
		// ping health including db
		authGroup.GET("/health", func(c *gin.Context) {

			err = db.PingContext(c)
			if err != nil {
				c.JSON(http.StatusFailedDependency, "db is down")
				return
			}

			c.JSON(http.StatusOK, "Service is running")
		})

		// OAuth callback endpoint
		authGroup.POST("/oauth/callback", handleOAuthCallback)
	}

    r.Run(":8080")
}

func handleOAuthCallback(c *gin.Context) {
	var requestBody struct {
		Email     string `json:"email"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON request"})
		log.Printf("%e",err)
		return
	}

	var userId string
	if err := db.QueryRow("SELECT id FROM users WHERE email = $1", requestBody.Email).Scan(&userId); err != nil {
		if err == sql.ErrNoRows {
			// User doesn't exist, insert new record
			newUUID := uuid.New().String()
			err = db.QueryRow("INSERT INTO users(id, email) VALUES($1, $2) RETURNING id", newUUID, requestBody.Email).Scan(&userId)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
				log.Printf("%e",err)
                return
            }
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
			log.Printf("%e",err)
			return
		}
	}

    // Generate JWT
    tokenString, err := utils.GenerateJWT(userId, requestBody.Email, jwtKey)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
		log.Printf("%e",err)
        return
    }

    // Send the token back to the user
    c.JSON(http.StatusOK, gin.H{"token": tokenString})
}
