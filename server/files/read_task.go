package files

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"gopkg.in/yaml.v3"
)

func InitTasks(features []string) (map[string]string, error) {
	ymlFiles := make(map[string]string)
	for _, dir := range features {
		err := filepath.Walk(dir+"/tasks", func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() && filepath.Ext(path) == ".yml" {
				fileName := strings.TrimSuffix(filepath.Base(path), ".yml")
				ymlFiles[fileName] = path
			}
			return nil
		})
		if err != nil {
			return ymlFiles, fmt.Errorf("Error walking the path %q: %v\n", dir, err)
		}
	}
	return ymlFiles, nil
}

func ReadTask(path string, modelSize string) (bool, types.LmTask, bool, error) {
	_, err := os.Stat(path)
	t := types.LmTask{}
	if os.IsNotExist(err) {
		return false, t, false, nil
	}
	file, err := os.Open(path)
	if err != nil {
		return true, t, false, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return true, t, false, err
	}
	err = yaml.Unmarshal([]byte(data), &t)
	if err != nil {
		return true, t, false, err
	}
	/*fmt.Println("M2", m2)
	prompt, ok := m2["prompt"].(string)
	if !ok {
		return false, t, fmt.Errorf("Error reading yaml: prompt")
	}
	t.Prompt = prompt*/
	//fmt.Println("Prompt", t.Prompt)
	t, useApi, err := convertTask(t, modelSize)
	if err != nil {
		return true, t, false, err
	}
	//fmt.Printf("Task: %+v\n", t)
	//ndata, _ := json.MarshalIndent(t, "", "  ")
	//fmt.Println(string(ndata))
	return true, t, useApi, nil
}

func keyExists(m map[string]interface{}, key string) bool {
	_, ok := m[key]
	return ok
}

func convertTask(task types.LmTask, modelSize string) (types.LmTask, bool, error) {
	//foundModel := false
	useApi := false
	if modelSize != "default" {
		if modelSize == "api" {
			if state.HasOaiApi {
				useApi = true
			}
		}
		if task.Models != nil {
			for size, mod := range task.Models {
				if size == modelSize {
					//mod := v.(map[string]interface{})
					task.Model.Name = mod.Name
					task.Model.Ctx = mod.Ctx
					//foundModel = true
				}
			}
		}
	}
	return task, useApi, nil
}
