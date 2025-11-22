package main

import (
	"flag"
	"fmt"

	"github.com/synw/agent-smith/server/conf"
	"github.com/synw/agent-smith/server/httpserver"
	"github.com/synw/agent-smith/server/state"
)

func main() {
	quiet := flag.Bool("q", false, "disable the verbose output")
	debug := flag.Bool("debug", false, "debug mode")
	genconf := flag.Bool("conf", false, "generate a config file")
	flag.Parse()
	if *genconf {
		conf.Create()
		fmt.Println("File server.config.json created")
		return
	}
	if *debug {
		fmt.Println("Debug mode is on")
		state.IsDebug = true
	}
	if !*quiet {
		state.IsVerbose = *quiet
	}
	state.IsVerbose = !*quiet
	state.Conf = conf.InitConf()
	//fmt.Println("Conf", config)
	if state.IsVerbose {
		fmt.Println("Starting the http server with allowed origins", state.Conf.Origins)
	}
	httpserver.RunServer()
}
