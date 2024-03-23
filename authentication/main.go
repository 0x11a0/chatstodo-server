package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	cmd "chatstodo/authentication/cmd"
	"chatstodo/authentication/internal/db"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

var (
	jwtKey []byte
	authDB *sql.DB
	postgresqlAddress string
	ctx = context.Background()
)

func main() {
	godotenv.Load("../.env")
	postgresqlAddress = os.Getenv("AUTH_POSTGRESQL_URL")
	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	redisAddress := os.Getenv("REDIS_URL")

	var err error
	jwtKey = []byte(jwtSecretKey)

	// Connect to PostgreSQL
    connStr := postgresqlAddress
    authDB, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
		return
    }

    if err = authDB.Ping(); err != nil {
        log.Fatal(err)
		return
    }
	log.Println("Connected to PostgreSQL")
	
	if err := db.MigrateDatabase(authDB); err != nil {
		log.Fatalf("Failed to migrate: %v", err)
		return
	}
	log.Println("Migration successful")
	
	// Connect to Redis
    opts, err := redis.ParseURL(redisAddress)
    if err != nil {
		log.Fatalf("Failed to enter redis: %v", err)
		return
    }
	redisClient := redis.NewClient(opts)

	// Pinging the Redis server
	_, err = redisClient.Ping(ctx).Result()
	if err != nil {
		fmt.Println("Error connecting to Redis:", err)
		return
	}
	log.Println("Connected to Redis")

	cmd.ExecuteCLI(authDB)
	cmd.ExecuteAPIServer(authDB, redisClient, jwtKey)

    
}

