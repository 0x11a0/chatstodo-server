package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	cmd "chatstodo/authentication/cmd"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

var (
	jwtKey []byte
	db *sql.DB
	postgresqlAddress string
	ctx = context.Background()
)

func main() {
	godotenv.Load("../.env")
	postgresqlAddress = os.Getenv("USER_POSTGRESQL_URL")
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	redisAddress := os.Getenv("REDIS_URL")

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
	log.Println("Connected to PostgreSQL")
	
	// Connect to Redis
    opts, err := redis.ParseURL(redisAddress)
    if err != nil {
        panic(err)
    }
	rdb := redis.NewClient(opts)

	// Pinging the Redis server
	_, err = rdb.Ping(ctx).Result()
	if err != nil {
		fmt.Println("Error connecting to Redis:", err)
		return
	}
	log.Println("Connected to Redis")

	cmd.ExecuteCLI(db)
	cmd.ExecuteAPIServer(db, jwtKey)

    
}

