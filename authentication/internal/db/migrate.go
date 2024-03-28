package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func MigrateDatabase(databaseConnection *sql.DB) error {
	if err := CreateUsersTable(databaseConnection); err != nil {
		log.Println("Users table created successfully.")
		return err
	}
	return nil
}

func CreateUsersTable(databaseConnection *sql.DB) error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	// Execute the SQL statement to create the table
	if _, err := databaseConnection.Exec(createTableSQL); err != nil {
		return err
	}
	return nil
}
