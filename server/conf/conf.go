package conf

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"

	"github.com/synw/agent-smith/server/types"

	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
)

func InitConf() types.Conf {
	viper.SetConfigName("server.config")
	viper.AddConfigPath(".")
	viper.SetDefault("origins", []string{"localhost"})
	viper.SetDefault("api_key", "")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	or := viper.GetStringSlice("origins")
	cmdak := viper.GetString("api_key")
	if cmdak == "" {
		log.Fatal("api_key is required in config")
	}
	return types.Conf{
		Origins:   or,
		CmdApiKey: cmdak,
	}
}

// Create : create a config file
func Create() {
	// Check if the file already exists
	if _, err := os.Stat("server.config.yaml"); err == nil {
		fmt.Println("Config file already exists. Skipping creation.")
		return
	}
	key := generateRandomKey()
	data := map[string]interface{}{
		"origins": []string{"http://localhost:5173", "http://localhost:5143", "http://localhost:4321"},
		"api_key": key,
	}
	yamlString, _ := yaml.Marshal(data)
	os.WriteFile("server.config.yaml", yamlString, 0600)
}

func generateRandomKey() string {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		panic(err.Error())
	}
	key := hex.EncodeToString(bytes)
	return key
}
