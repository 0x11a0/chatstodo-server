package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var (
	jwtKey = []byte("your_secret_key")
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

	// const BaseURL = "http://localhost:8000"
	// goth.UseProviders(
	// 	google.New(os.Getenv("GPLUS_KEY"), os.Getenv("GPLUS_SECRET"), BaseURL+"/auth/google/callback"),
	// )

    // Connect to PostgreSQL
    connStr := postgresqlAddress
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    // Initialize Gin
    r := gin.Default()

	// ping health including db
	r.GET("/health", func(c *gin.Context) {

		err = db.PingContext(c)
		if err != nil {
			c.JSON(http.StatusFailedDependency, "db is down")
			return
		}

		c.JSON(http.StatusOK, "Service is running")
	})
    // OAuth callback endpoint
    // r.GET("/oauth/callback", handleOAuthCallback)

    // Start the server
    r.Run(":8080") // Listen and serve on 0.0.0.0:8080
}

// func handleOAuthCallback(c *gin.Context) {
// 	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
// 	if err != nil {
// 		c.AbortWithError(http.StatusInternalServerError, err)
// 		return
// 	}


//     var userID int
//     err = db.QueryRow("SELECT id FROM users WHERE email = $1", user.Email).Scan(&userID)
//     if err == sql.ErrNoRows {
//         // User doesn't exist, insert new record
//         err = db.QueryRow("INSERT INTO users(email) VALUES($1) RETURNING id", user.Email).Scan(&userID)
//         if err != nil {
//             c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
//             return
//         }
//     } else if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
//         return
//     }

//     // Generate JWT
//     tokenString, err := generateJWT(userID, user.Email)
//     if err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
//         return
//     }

//     // Send the token back to the user
//     c.JSON(http.StatusOK, gin.H{"token": tokenString})
// }

// Function to generate JWT
func generateJWT(userID int, email string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": userID,
        "email":   email,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    })

    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}
