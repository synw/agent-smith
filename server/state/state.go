package state

import (
	"fmt"

	"github.com/synw/agent-smith/server/files"
)

// app state
var IsVerbose = true
var IsDebug = false

// inference state
var ContinueInferingController = true
var IsInfering = false

// models
var ModelSize = "xsmall"

var Tasks = map[string]string{}

func Init(features []string) error {
	ts, err := files.InitTasks(features)
	if err != nil {
		return err
	}
	Tasks = ts
	if IsDebug {
		fmt.Println("Tasks:", Tasks)
	}
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
