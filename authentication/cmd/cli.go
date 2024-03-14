package cli

import (
	"chatstodo/authentication/internal/db"
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
)

var (
	rootCmd     = &cobra.Command{Use: "myapp"}
	postgreAddress string
)


// migrateCmd represents the migrate command
var migrateCmd = &cobra.Command{
    Use:   "migrate",
    Short: "Migrate the database",
    Long:  `This command will create the users table in the database.`,
    Run: func(cmd *cobra.Command, args []string) {
        db.MigrateDatabase(postgreAddress)
		os.Exit(1)
    },
}

func Execute(address string) {

	postgreAddress = address
    rootCmd.AddCommand(migrateCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
		return
	}
}
