package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func MigrateDatabase(address string) {
	CreateUsersTable(address)
}

func CreateUsersTable(address string) {
	// Connect to the database
	db, err := sql.Open("postgres", address)
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
	defer db.Close()

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	// Execute the SQL statement to create the table
	if _, err := db.Exec(createTableSQL); err != nil {
		log.Fatalf("Failed to execute query: %v", err)
	} else {
		fmt.Println("Users table created successfully.")
	}
}
