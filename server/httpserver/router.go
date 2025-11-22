package httpserver

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func RunServer(origins []string, cmdApîKey string) {
	e := echo.New()

	// logger
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "${method} ${status} ${uri} ${latency_human} ${remote_ip} ${error}\n",
	}))
	if l, ok := e.Logger.(*log.Logger); ok {
		l.SetHeader("[${time_rfc3339}] ${level}")
	}

	//cors
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     origins,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
		AllowMethods:     []string{http.MethodGet, http.MethodOptions, http.MethodPost},
		AllowCredentials: true,
	}))

	cmds := e.Group("/cmd")
	cmds.Use(middleware.KeyAuth(func(key string, c echo.Context) (bool, error) {
		if key == cmdApîKey {
			//c.Set("apiKey", key)
			return true, nil
		}
		return false, nil
	}))
	//tasks.GET("/abort", AbortHandler)
	cmds.POST("/execute", ExecuteCmdHandler)

	e.Start(":5042")
}
