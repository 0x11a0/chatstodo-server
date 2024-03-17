package main

import (
	"database/sql"
	"log"
	"os"

	cmd "chatstodo/authentication/cmd"

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

	// Connect to PostgreSQL
    connStr := postgresqlAddress
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }

    if err = db.Ping(); err != nil {
        log.Fatal(err)
    }

	cmd.ExecuteCLI(db)
	cmd.ExecuteAPIServer(db, jwtKey)

    
}

