package state

import (
	"fmt"
	"slices"
)

// app state
var IsVerbose = true
var IsDebug = false

// inference state
var ContinueInferingController = true
var IsInfering = false

// models
var ModelsConf = make((map[string]string))

// tasks
var Tasks = map[string]string{}

// oai api
var HasOaiApi = false

func Init(features []string, models map[string]string, hasOai bool, tasks map[string]string) error {
	ModelsConf = models
	if IsDebug {
		fmt.Println("Models conf:", ModelsConf)
	}
	Tasks = tasks
	if IsDebug {
		fmt.Print("Found ", len(Tasks), " tasks:")
		var keys []string
		for k := range Tasks {
			keys = append(keys, k)
		}
		// Sort the keys
		slices.Sort(keys)
		for _, tn := range keys {
			fmt.Print(" ", tn)
		}
		fmt.Println()
	}
	HasOaiApi = hasOai
	return nil
}

func GetTask(name string) (bool, string, string) {
	found := false
	tn := ""
	tp := ""
	for k, v := range Tasks {
		if k == name {
			found = true
			tn = k
			tp = v
		}
	}
	return found, tn, tp
}
