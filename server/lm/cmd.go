package lm

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os/exec"

	"github.com/labstack/echo/v4"
	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"
)

func RunCmd(
	cmdName string,
	params []string,
	c echo.Context,
	ch chan<- types.StreamedMessage,
	errCh chan<- types.StreamedMessage,
) {
	// Create the command with the arguments
	params = append([]string{cmdName}, params...)
	if state.IsDebug {
		fmt.Println("Cmd params:")
		for _, p := range params {
			fmt.Println("-", p)
		}
	}
	cmd := exec.Command("lm", params...)
	//cmd.Env = append(os.Environ(), "LANG=en_US.UTF-8")

	// Create a pipe to capture the command's output
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		msg := fmt.Errorf("Error creating stdout pipe: %v", err)
		errCh <- createErrorMsg(msg.Error())
		return
	}

	// Start the command
	if err := cmd.Start(); err != nil {
		msg := fmt.Errorf("Error starting command: %v", err)
		errCh <- createErrorMsg(msg.Error())
		return
	}

	decoder := bufio.NewReader(stdout)
	scanner := bufio.NewScanner(decoder)
	scanner.Split(bufio.ScanRunes)

	enc := json.NewEncoder(c.Response())
	enc.SetEscapeHTML(false)
	i := 0
	for scanner.Scan() {
		i++
		token := scanner.Text()
		if state.IsVerbose {
			fmt.Print(token)
		}
		StreamMsg(createMsg(token, i), c, enc)
	}

	// Check for errors during scanning
	if err := scanner.Err(); err != nil {
		msg := fmt.Errorf("Error reading output: %v", err)
		fmt.Println(msg)
		errCh <- createErrorMsg(msg.Error())
	}

	// Wait for the command to finish
	if err := cmd.Wait(); err != nil {
		msg := fmt.Errorf("Command finished with error: %v", err)
		errCh <- createErrorMsg(msg.Error())
	}
}
