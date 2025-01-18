package conf

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/synw/agent-smith/server/types"

	"github.com/spf13/viper"
	"gopkg.in/yaml.v3"
)

func InitConf() types.Conf {
	viper.SetConfigName("server.config")
	viper.AddConfigPath(".")
	viper.SetDefault("origins", []string{"localhost"})
	viper.SetDefault("cmd_api_key", nil)
	viper.SetDefault("features", []string{})
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("fatal error config file: %w", err))
	}
	or := viper.GetStringSlice("origins")
	ak := viper.GetString("api_key")
	cmdak := viper.GetString("cmd_api_key")
	ft := viper.GetStringSlice("features")
	return types.Conf{
		Origins:   or,
		ApiKey:    ak,
		CmdApiKey: &cmdak,
		Features:  ft,
	}
}

// Create : create a config file
func Create(isDefault bool) {
	// Check if the file already exists
	if _, err := os.Stat("server.config.yaml"); err == nil {
		fmt.Println("Config file already exists. Skipping creation.")
		return
	}
	key := "7aea109636aefb984b13f9b6927cd174425a1e05ab5f2e3935ddfeb183099465"
	if !isDefault {
		key = generateRandomKey()
	}
	data := map[string]interface{}{
		"origins": []string{"http://localhost:5173", "http://localhost:5143"},
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
