package httpserver

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/synw/agent-smith/server/files"
	"github.com/synw/agent-smith/server/lm"
	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"

	"github.com/labstack/echo/v4"
)

func ExecuteTaskHandler(c echo.Context) error {
	m := echo.Map{}
	if err := c.Bind(&m); err != nil {
		return err
	}

	v, ok := m["task"]
	taskName := ""
	if ok {
		taskName = v.(string)
	} else {
		msg := "Provide a 'task' string parameter"
		return echo.NewHTTPError(http.StatusBadRequest, msg)
	}
	v, ok = m["prompt"]
	prompt := ""
	if ok {
		prompt = v.(string)
	} else {
		msg := "Provide a 'prompt' string parameter"
		return echo.NewHTTPError(http.StatusBadRequest, msg)
	}
	v, ok = m["vars"]
	vars := make(map[string]interface{})
	if ok {
		vars = v.(map[string]interface{})
	}
	found, _, tp := state.GetTask(taskName)
	if !found {
		msg := "Task " + taskName + " not found"
		if state.IsDebug {
			fmt.Println(msg)
		}
		return echo.NewHTTPError(http.StatusBadRequest, msg)
	}
	ms, ok := state.ModelsConf[taskName]
	if !ok {
		ms = "default"
	}
	ok, task, useApi, err := files.ReadTask(tp, ms)
	if err != nil {
		log.Println(err)
		return c.NoContent(http.StatusInternalServerError)
	}
	if !ok {
		return c.NoContent(http.StatusBadRequest)
	}
	c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	c.Response().WriteHeader(http.StatusOK)
	ch := make(chan types.StreamedMessage)
	errCh := make(chan types.StreamedMessage)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		lm.InferTask(prompt, vars, task, useApi, c, ch, errCh, c.Request().Context())
	}()

	select {
	case res, ok := <-ch:
		if ok {
			if state.IsDebug {
				fmt.Println("-------- result ----------")
				for key, value := range res.Data {
					fmt.Printf("%s: %v\n", key, value)
				}
				fmt.Println("--------------------------")
			}
		}
		wg.Wait()
		close(ch)
		close(errCh)
		return nil
	case err, ok := <-errCh:
		if ok {
			enc := json.NewEncoder(c.Response())
			err := lm.StreamMsg(err, c, enc)
			if err != nil {
				if state.IsDebug {
					fmt.Println("Streaming error", err)
					errCh <- types.StreamedMessage{
						Content: "Streaming error",
						MsgType: types.ErrorMsgType,
					}
				}
				wg.Wait()
				close(ch)
				close(errCh)
				return c.NoContent(http.StatusInternalServerError)
			}
		} else {
			wg.Wait()
			close(ch)
			close(errCh)
			return c.JSON(http.StatusInternalServerError, err)
		}
		wg.Wait()
		close(ch)
		close(errCh)
		return nil
	case <-c.Request().Context().Done():
		fmt.Println("\nRequest canceled")
		wg.Wait()
		close(ch)
		close(errCh)
		return c.NoContent(http.StatusNoContent)
	}
}
