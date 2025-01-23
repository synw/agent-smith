package httpserver

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/synw/agent-smith/server/lm"
	"github.com/synw/agent-smith/server/state"
	"github.com/synw/agent-smith/server/types"
)

func ExecuteCmdHandler(c echo.Context) error {
	m := echo.Map{}
	if err := c.Bind(&m); err != nil {
		return err
	}
	cmd, ok := m["cmd"]
	if !ok {
		msg := "Provide a 'cmd' string parameter"
		return echo.NewHTTPError(http.StatusBadRequest, msg)
	}
	params, ok := m["params"]
	if !ok {
		params = []string{}
	}

	c.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	c.Response().WriteHeader(http.StatusOK)
	ch := make(chan types.StreamedMessage)
	errCh := make(chan types.StreamedMessage)

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		rawParams := params.([]interface{})
		params := lm.InterfaceToStringArray(rawParams)
		lm.RunCmd(cmd.(string), params, c, ch, errCh)
	}()

	select {
	case res, ok := <-ch:
		if ok {
			fmt.Println("ch", res)
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
		state.ContinueInferingController = false
		wg.Wait()
		close(ch)
		close(errCh)
		return c.NoContent(http.StatusNoContent)
	}
}
