package lm

import (
	"fmt"

	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"github.com/labstack/echo/v4"
)

func InferTask(
	prompt string,
	vars map[string]interface{},
	task types.LmTask,
	useApi bool,
	c echo.Context,
	ch chan<- types.StreamedMessage,
	errCh chan<- types.StreamedMessage,
) {
	state.IsInfering = true
	state.ContinueInferingController = true
	var finalPrompt string
	var stop []string
	var err error
	if !useApi {
		finalPrompt, stop, err = ollamaFormatPrompt(task, prompt, vars)
		if err != nil {
			errCh <- types.StreamedMessage{
				Content: err.Error(),
				MsgType: types.ErrorMsgType,
			}
		}
	} else {
		finalPrompt, stop, err = oaiFormatPrompt(task, prompt, vars)
	}
	if state.IsDebug {
		//fmt.Println("Inference params:")
		//fmt.Println(params)
		fmt.Println("---------- prompt ----------")
		fmt.Println(finalPrompt)
		fmt.Println("----------------------------")
	}
	if state.IsVerbose {
		fmt.Println("Ingesting prompt ..")
	}
	//fmt.Println("Stop", stop)
	for _, s := range stop {
		st, ok := task.InferParams["stop"]
		if st == nil || !ok {
			task.InferParams["stop"] = []string{}
		}
		task.InferParams["stop"] = append(task.InferParams["stop"].([]string), s)
	}
	if state.IsDebug {
		fmt.Println("Inference params:")
		fmt.Printf("%+v\n", task.InferParams)
	}
	if !useApi {
		if state.IsDebug {
			fmt.Println("Using model", task.Model)
		}
		ip, err := ollamaConvertInferParams(task.InferParams)
		if err != nil {
			errCh <- types.StreamedMessage{
				Content: err.Error(),
				MsgType: types.ErrorMsgType,
			}
		}
		ollamaInfer(finalPrompt, task.Model, ip, c, ch, errCh)
	} else {
		if state.IsDebug {
			fmt.Println("Using api")
		}
		system := ""
		sys, ok := task.Template["system"]
		if ok {
			system = sys
		}
		OaiInfer(finalPrompt, task.Model, task.InferParams, task.Shots, system, c, ch, errCh)
	}

}
