package lm

import (
	"fmt"
	"strings"

	"github.com/synw/agent-smith/server/types"
	modprompt "github.com/synw/gomodprompt"
)

func processVars(task types.LmTask, vars map[string]interface{}) types.LmTask {
	if task.Variables.Required != nil {
		for _, v := range task.Variables.Required {
			task.Prompt = strings.Replace(task.Prompt, "{"+v+"}", vars[v].(string), 1)
		}
	}
	if task.Variables.Optional != nil {
		for _, v := range task.Variables.Optional {
			tv, ok := vars[v]
			if ok {
				task.Prompt = strings.Replace(task.Prompt, "{"+v+"}", tv.(string), 1)
			} else {
				task.Prompt = strings.Replace(task.Prompt, "{"+v+"}", "", 1)
			}
		}
	}
	return task
}

func oaiFormatPrompt(task types.LmTask, userPrompt string, vars map[string]interface{}) (string, []string, error) {
	task.Prompt = strings.Replace(task.Prompt, "{prompt}", userPrompt, 1)
	task = processVars(task, vars)
	return task.Prompt, []string{}, nil
}

func ollamaFormatPrompt(task types.LmTask, userPrompt string, vars map[string]interface{}) (string, []string, error) {
	// Initialize a template by name
	tpl, err := modprompt.InitTemplate(task.Model.Template)
	if err != nil {
		//fmt.Println("Error initializing template:", err)
		return "", []string{}, fmt.Errorf("Error initializing template: %v", err)
	}
	// variables
	//fmt.Println("VARS", vars)
	task.Prompt = strings.Replace(task.Prompt, "{prompt}", userPrompt, 1)
	processVars(task, vars)
	promptTemplate := &modprompt.PromptTemplate{
		ID:         tpl.ID,
		Name:       tpl.Name,
		User:       tpl.User,
		Assistant:  tpl.Assistant,
		System:     tpl.System,
		Shots:      tpl.Shots,
		Stop:       tpl.Stop,
		Linebreaks: tpl.Linebreaks,
		AfterShot:  tpl.AfterShot,
		Prefix:     tpl.Prefix,
	}
	for _, shot := range task.Shots {
		promptTemplate.AddShot(shot.User, shot.Assistant)
	}
	for k, v := range task.Template {
		if k == "system" {
			promptTemplate.ReplaceSystem(v)
		}
		if k == "assistant" {
			promptTemplate.AfterAssistant(v)
		}
	}
	return promptTemplate.Prompt(task.Prompt), promptTemplate.Stop, nil
}
