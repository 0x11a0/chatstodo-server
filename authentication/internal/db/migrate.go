package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func MigrateDatabase(databaseConnection *sql.DB) {
	CreateUsersTable(databaseConnection)
}

func CreateUsersTable(databaseConnection *sql.DB) {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	// Execute the SQL statement to create the table
	if _, err := databaseConnection.Exec(createTableSQL); err != nil {
		log.Fatalf("Failed to execute query: %v", err)
	} else {
		fmt.Println("Users table created successfully.")
	}
}
