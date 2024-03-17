package cmd

import (
	"chatstodo/authentication/internal/db"
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
)

var (
	rootCmd     = &cobra.Command{Use: "myapp"}
	databaseConnection *sql.DB
)


// migrateCmd represents the migrate command
var migrateCmd = &cobra.Command{
    Use:   "migrate",
    Short: "Migrate the database",
    Long:  `This command will create the users table in the database.`,
    Run: func(cmd *cobra.Command, args []string) {
        db.MigrateDatabase(databaseConnection)
		os.Exit(1)
    },
}

func ExecuteCLI(databaseConnection *sql.DB) {

    rootCmd.AddCommand(migrateCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
		return
	}
}
