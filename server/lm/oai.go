package lm

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/sashabaranov/go-openai"
	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"
)

var oaiCli *openai.Client

func InitOaiCli(aoiApiParams map[string]string) bool {
	// oai api
	oaiBase := ""
	oaiKey := ""
	hasOai := false
	url, ok := aoiApiParams["base_url"]
	if ok {
		hasOai = true
		oaiBase = url
		key, _ok := aoiApiParams["api_key"]
		if _ok {
			oaiKey = key
		}
	}
	config := openai.DefaultConfig(oaiKey)
	config.BaseURL = oaiBase
	oaiCli = openai.NewClientWithConfig(config)
	return hasOai
}
func OaiInfer(
	prompt string,
	model types.ModelConf,
	inferParams map[string]interface{},
	shots []types.TurnBlock,
	system string,
	c echo.Context,
	ch chan<- types.StreamedMessage,
	errCh chan<- types.StreamedMessage,
	ctx context.Context,
) error {
	req := openai.ChatCompletionRequest{
		Model:               model.Name,
		MaxCompletionTokens: inferParams["max_tokens"].(int),
		Messages:            []openai.ChatCompletionMessage{},
		Stream:              true,
	}
	p, ok := inferParams["temperature"]
	if ok {
		req.Temperature = float32(p.(float64))
	}
	p2, ok := inferParams["top_p"]
	if ok {
		req.TopP = float32(p2.(float64))
	}
	p3, ok := inferParams["stop"]
	if ok {
		req.Stop = p3.([]string)
	}
	p4, ok := inferParams["presence_penalty"]
	if ok {
		req.PresencePenalty = float32(p4.(float64))
	}
	p5, ok := inferParams["frequency_penalty"]
	if ok {
		req.FrequencyPenalty = float32(p5.(float64))
	}
	if len(system) > 0 {
		req.Messages = append(req.Messages,
			openai.ChatCompletionMessage{
				Role:    openai.ChatMessageRoleSystem,
				Content: system,
			})
	}
	for _, shot := range shots {
		req.Messages = append(req.Messages,
			openai.ChatCompletionMessage{
				Role:    openai.ChatMessageRoleUser,
				Content: shot.User,
			},
			openai.ChatCompletionMessage{
				Role:    openai.ChatMessageRoleAssistant,
				Content: shot.Assistant,
			},
		)
	}
	req.Messages = append(req.Messages, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: prompt,
	})
	stream, err := oaiCli.CreateChatCompletionStream(ctx, req)
	if err != nil {
		fmt.Printf("ChatCompletionStream error: %v\n", err)
		return err
	}
	enc := json.NewEncoder(c.Response())
	defer stream.Close()
	startThinking := time.Now()
	startEmitting := time.Now()
	var thinkingElapsed time.Duration
	buf := []string{}
	ntokens := 0
	for {
		response, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			fmt.Println("\nStream EOF")
			emittingElapsed := time.Since(startEmitting)
			if state.IsVerbose {
				fmt.Println("\n\nEmitting time:", emittingElapsed)
			}
			tpsRaw := float64(ntokens) / emittingElapsed.Seconds()
			s := fmt.Sprintf("%.2f", tpsRaw)
			tps := 0.0
			if res, err := strconv.ParseFloat(s, 64); err == nil {
				tps = res
			}
			totalTime := thinkingElapsed + emittingElapsed
			if state.IsVerbose {
				fmt.Println("Total time:", totalTime)
				fmt.Println("Tokens per seconds", tps)
				fmt.Println("Tokens emitted", ntokens)
			}
			stats := types.InferenceStats{
				ThinkingTime:       thinkingElapsed.Seconds(),
				ThinkingTimeFormat: thinkingElapsed.String(),
				EmitTime:           emittingElapsed.Seconds(),
				EmitTimeFormat:     emittingElapsed.String(),
				TotalTime:          totalTime.Seconds(),
				TotalTimeFormat:    totalTime.String(),
				TokensPerSecond:    tps,
				TotalTokens:        ntokens,
			}
			result := types.InferenceResult{
				Text:  strings.Join(buf, ""),
				Stats: stats,
			}
			b, _ := json.Marshal(&result)
			var _res map[string]interface{}
			_ = json.Unmarshal(b, &_res)
			endmsg := types.StreamedMessage{
				Num:     ntokens + 1,
				Content: "result",
				MsgType: types.SystemMsgType,
				Data:    _res,
			}
			StreamMsg(endmsg, c, enc)
			ch <- endmsg
			break
		}
		if err != nil {
			fmt.Printf("\nStream error: %v\n", err)
			msg := createErrorMsg("Streaming error")
			StreamMsg(msg, c, enc)
			errCh <- msg
			return err
		}
		if ntokens == 0 {
			startEmitting = time.Now()
			thinkingElapsed = time.Since(startThinking)
			if state.IsVerbose {
				fmt.Println("Thinking time:", thinkingElapsed)
				fmt.Println("Emitting ..")
				fmt.Println()
			}
			smsg := types.StreamedMessage{
				Num:     ntokens,
				Content: "start_emitting",
				MsgType: types.SystemMsgType,
				Data: map[string]interface{}{
					"thinking_time":        thinkingElapsed,
					"thinking_time_format": thinkingElapsed.String(),
				},
			}
			if state.ContinueInferingController {
				StreamMsg(smsg, c, enc)
				time.Sleep(1 * time.Millisecond)
			}
		}
		if state.ContinueInferingController {
			token := response.Choices[0].Delta.Content
			if state.IsVerbose {
				go fmt.Print(token)
			}
			tmsg := types.StreamedMessage{
				Content: token,
				Num:     ntokens,
				MsgType: types.TokenMsgType,
			}
			StreamMsg(tmsg, c, enc)
			buf = append(buf, token)
		}
		ntokens++
	}
	return nil
}
