package types

type Conf struct {
	Origins   []string
	CmdApiKey string
	Groups    map[GroupName]AuthorizedCmds
}

type GroupName string
type AuthorizedCmds []string

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
