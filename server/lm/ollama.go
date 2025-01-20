package lm

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"github.com/labstack/echo/v4"
	"github.com/ollama/ollama/api"
)

func ollamaInfer(
	prompt string,
	model types.ModelConf,
	inferParams map[string]interface{},
	c echo.Context,
	ch chan<- types.StreamedMessage,
	errCh chan<- types.StreamedMessage) error {
	client, err := api.ClientFromEnvironment()
	if err != nil {
		log.Fatal(err)
	}

	// By default, GenerateRequest is streaming.
	req := &api.GenerateRequest{
		Model:   model.Name,
		Prompt:  prompt,
		Options: inferParams,
		Raw:     true,
	}

	ctx := context.Background()
	startThinking := time.Now()
	startEmitting := time.Now()
	var thinkingElapsed time.Duration
	ntokens := 0
	buf := []string{}
	enc := json.NewEncoder(c.Response())
	respFunc := func(resp api.GenerateResponse) error {
		if ntokens == 0 {
			startEmitting = time.Now()
			thinkingElapsed = time.Since(startThinking)
			if state.IsVerbose {
				fmt.Println("Thinking time:", thinkingElapsed)
				fmt.Println("Emitting ..\n")
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
				// sleep to let the time to stream this message, as a second
				// message with the token has to be streamed in this loop as well
				time.Sleep(1 * time.Millisecond)
			}
		}
		token := resp.Response
		//_, isStopToken := inferParams["stop"].([]string)
		//if !isStopToken {
		buf = append(buf, token)
		//}
		if state.IsVerbose {
			go fmt.Print(token)
		}
		tmsg := types.StreamedMessage{
			Content: token,
			Num:     ntokens,
			MsgType: types.TokenMsgType,
		}
		if state.ContinueInferingController {
			go StreamMsg(tmsg, c, enc)
		}
		ntokens++
		//}
		return nil
	}

	err = client.Generate(ctx, req, respFunc)
	if err != nil {
		errCh <- types.StreamedMessage{
			Num:     ntokens + 1,
			Content: "inference error",
			MsgType: types.ErrorMsgType,
		}
	}
	if state.ContinueInferingController {
		// the inference was not aborted
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
		// result
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
	}
	return nil
}

func convertInferParams(inferParams map[string]interface{}) (map[string]interface{}, error) {
	ip := make(map[string]interface{})
	for k, v := range inferParams {
		if k == "max_tokens" {
			ip["num_predict"] = v
		} else if k == "tfs" {
			ip["tfs_z"] = v
		} else {
			ip[k] = v
		}
	}
	return ip, nil
}
