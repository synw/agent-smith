package lm

import (
	"encoding/json"
	"fmt"

	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"github.com/labstack/echo/v4"
)

func StreamMsg(msg types.StreamedMessage, c echo.Context, enc *json.Encoder) error {
	c.Response().Write([]byte("data: "))
	if err := enc.Encode(msg); err != nil {
		return err
	}
	c.Response().Write([]byte("\n"))
	c.Response().Flush()
	return nil
}

func InferTask(
	prompt string,
	vars map[string]interface{},
	task types.LmTask,
	c echo.Context,
	ch chan<- types.StreamedMessage,
	errCh chan<- types.StreamedMessage,
) {
	state.IsInfering = true
	state.ContinueInferingController = true
	finalPrompt, stop, err := formatPrompt(task, prompt, vars)
	if err != nil {
		errCh <- types.StreamedMessage{
			Content: err.Error(),
			MsgType: types.ErrorMsgType,
		}
	}
	if state.IsVerbose {
		//fmt.Println("Inference params:")
		//fmt.Println(params)
		fmt.Println("---------- prompt ----------")
		fmt.Println(finalPrompt)
		fmt.Println("----------------------------")
		fmt.Println("Thinking ..")
	}
	if state.IsDebug {
		fmt.Println("Inference params:")
		fmt.Printf("%+v\n\n", task.InferParams)

	}
	for _, s := range stop {
		task.InferParams.Stop = append(task.InferParams.Stop, s)
	}
	ip, err := StructToMap(task.InferParams)
	if err != nil {
		errCh <- types.StreamedMessage{
			Content: err.Error(),
			MsgType: types.ErrorMsgType,
		}
	}

	ollamaInfer(finalPrompt, task.Model, ip, c, ch, errCh)
}
