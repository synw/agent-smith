package files

import (
	"io"
	"os"

	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"gopkg.in/yaml.v3"
)

func keyExists(m map[string]interface{}, key string) bool {
	_, ok := m[key]
	return ok
}

func convertTask(task types.LmTask) (types.LmTask, error) {
	//foundModel := false
	if task.Models != nil {
		for size, mod := range task.Models {
			if size == state.ModelSize {
				//mod := v.(map[string]interface{})
				task.Model.Name = mod.Name
				task.Model.Ctx = mod.Ctx
				//foundModel = true
			}
		}
	}
	/*if !foundModel {
		return task, fmt.Errorf("No model found in task " + task.Name)
	}*/
	/*ip := state.DefaultInferenceParams
	for k, v := range m.InferParams {
		//fmt.Println("P", k, v)
		switch k {
		case "max_tokens":
			ip.MaxTokens = v.(int)
		case "top_k":
			ip.TopK = v.(int)
		case "top_p":
			ip.TopP = v.(float64)
		case "min_p":
			ip.MinP = v.(float64)
		case "temperature":
			ip.Temperature = v.(float64)
		case "repeat_penalty":
			ip.RepeatPenalty = v.(float64)
		case "tfs_z":
			ip.TFS = v.(float64)
		case "grammar":
			ip.Grammar = v.(string)
		case "stop":
			s := v.([]interface{})
			t := []string{}
			for _, v = range s {
				t = append(t, v.(string))
			}
			ip.Stop = t
		case "images":
			s := v.([]interface{})
			t := []string{}
			for _, v = range s {
				t = append(t, v.(string))
			}
			ip.Images = t
		}

	}
	task.InferParams = ip*/
	return task, nil
}

func ReadTask(name string) (bool, types.LmTask, error) {
	//var task types.Task
	//m2 := make(map[string]interface{})
	//p := filepath.Join(state.TasksDir, path)
	p := state.TasksDir + "/" + name + ".yml"
	//fmt.Println("Opening", p)
	_, err := os.Stat(p)
	t := types.LmTask{}
	if os.IsNotExist(err) {
		return false, t, nil
	}
	file, err := os.Open(p)
	if err != nil {
		return true, t, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return true, t, err
	}
	err = yaml.Unmarshal([]byte(data), &t)
	if err != nil {
		return true, t, err
	}
	/*fmt.Println("M2", m2)
	prompt, ok := m2["prompt"].(string)
	if !ok {
		return false, t, fmt.Errorf("Error reading yaml: prompt")
	}
	t.Prompt = prompt*/
	//fmt.Println("Prompt", t.Prompt)
	t, err = convertTask(t)
	if err != nil {
		return true, t, err
	}
	/*fmt.Printf("Task: %+v\n", t)
	ndata, _ := json.MarshalIndent(t, "", "  ")
	fmt.Println(string(ndata))*/

	return true, t, nil
}
