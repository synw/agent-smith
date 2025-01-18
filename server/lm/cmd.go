package lm

import (
	"bufio"
	"fmt"
	"os/exec"

	"github.com/labstack/echo/v4"
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
	fmt.Println("Params:")
	for _, p := range params {
		fmt.Println("-", p)
	}
	fmt.Println("Cmd", "lm", params)
	cmd := exec.Command("lm", params...)

	// Create a pipe to capture the command's output
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		msg := fmt.Errorf("Error creating stdout pipe:", err)
		errCh <- createErrorMsg(msg.Error())
		return
	}

	// Start the command
	if err := cmd.Start(); err != nil {
		msg := fmt.Errorf("Error starting command:", err)
		errCh <- createErrorMsg(msg.Error())
		return
	}

	// Create a scanner to read the output word by word
	scanner := bufio.NewScanner(stdout)
	scanner.Split(bufio.ScanWords) // Set the split function to scan words

	// Read and print the output word by word
	i := 0
	for scanner.Scan() {
		i++
		token := scanner.Text()
		fmt.Println("T", token)
		ch <- createMsg(token, i)
	}

	// Check for errors during scanning
	if err := scanner.Err(); err != nil {
		msg := fmt.Errorf("Error reading output:", err)
		fmt.Println(msg)
		errCh <- createErrorMsg(msg.Error())
	}

	// Wait for the command to finish
	if err := cmd.Wait(); err != nil {
		msg := fmt.Errorf("Command finished with error:", err)
		errCh <- createErrorMsg(msg.Error())
	}
}
