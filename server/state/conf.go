package state

import "github.com/synw/agent-smith/server/types"

var DefaultInferenceParams = types.InferenceParams{
	Stream:        false,
	MaxTokens:     512,
	TopK:          40,
	TopP:          0.95,
	MinP:          0.05,
	Temperature:   0.2,
	RepeatPenalty: 1.0,
	TFS:           1.0,
	Stop:          []string{},
}

var DefaultModelConf = types.ModelConf{
	Name: "",
	Ctx:  2048,
}
