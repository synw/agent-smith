package types

type Conf struct {
	Origins   []string
	ApiKey    string
	CmdApiKey *string
	Features  []string
	Models    map[string]string
}

// ModelConf represents the configuration for a language model.
type ModelConf struct {
	Name     string `json:"name"`
	Ctx      int    `json:"ctx"`
	Template string `json:"template,omitempty"`
}

// TurnBlock represents a dialogue turn in a task.
type TurnBlock struct {
	// Define the fields of TurnBlock based on the actual implementation in "modprompt"
	// For example:
	User      string `json:"user"`
	Assistant string `json:"assistant"`
}

// LmTask represents a language model task.
type LmTask struct {
	Name        string                 `json:"name" yaml:"name"`
	Description string                 `json:"description" yaml:"description"`
	Prompt      string                 `json:"prompt" yaml:"prompt"`
	Template    map[string]string      `json:"template,omitempty" yaml:"template,omitempty"`
	Model       ModelConf              `json:"model" yaml:"model"`
	Models      map[string]ModelConf   `json:"models,omitempty" yaml:"models,omitempty"`
	InferParams map[string]interface{} `json:"inferParams,omitempty" yaml:"inferParams,omitempty"`
	Shots       []TurnBlock            `json:"shots,omitempty" yaml:"shots,omitempty"`
	Variables   struct {
		Required []string `json:"required,omitempty" yaml:"required,omitempty"`
		Optional []string `json:"optional,omitempty" yaml:"optional,omitempty"`
	} `json:"variables,omitempty" yaml:"variables,omitempty"`
}

type MsgType string

const (
	TokenMsgType  MsgType = "token"
	SystemMsgType MsgType = "system"
	ErrorMsgType  MsgType = "error"
)

type StreamedMessage struct {
	Content string                 `json:"content"`
	Num     int                    `json:"num"`
	MsgType MsgType                `json:"msg_type"`
	Data    map[string]interface{} `json:"data,omitempty"`
}

type InferenceStats struct {
	ThinkingTime       float64 `json:"thinkingTime"`
	ThinkingTimeFormat string  `json:"thinkingTimeFormat"`
	EmitTime           float64 `json:"emitTime"`
	EmitTimeFormat     string  `json:"emitTimeFormat"`
	TotalTime          float64 `json:"totalTime"`
	TotalTimeFormat    string  `json:"totalTimeFormat"`
	TokensPerSecond    float64 `json:"tokensPerSecond"`
	TotalTokens        int     `json:"totalTokens"`
}

type InferenceResult struct {
	Text  string         `json:"text"`
	Stats InferenceStats `json:"stats"`
}
