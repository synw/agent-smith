package lm

import (
	"fmt"
	"reflect"

	"github.com/synw/agent-smith/server/types"
)

func StructToMap(s interface{}) (map[string]interface{}, error) {
	v := reflect.ValueOf(s)
	if v.Kind() == reflect.Ptr {
		v = v.Elem()
	}
	if v.Kind() != reflect.Struct {
		return nil, fmt.Errorf("input is not a struct")
	}

	m := make(map[string]interface{})
	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		tag := field.Tag.Get("json")
		if tag == "" {
			tag = field.Name
		}
		m[tag] = v.Field(i).Interface()
	}

	return m, nil
}

func InterfaceToStringArray(interfaceSlice []interface{}) []string {
	// Convert to slice of string
	stringSlice := make([]string, 0, len(interfaceSlice))
	for _, v := range interfaceSlice {
		if str, ok := v.(string); ok {
			stringSlice = append(stringSlice, str)
		} else {
			// Handle the case where the element is not a string
			fmt.Printf("Skipping non-string element in interfaceToStringArray: %v\n", v)
		}
	}
	return stringSlice
}

func createMsg(msg string, n int) types.StreamedMessage {
	return types.StreamedMessage{
		Content: msg,
		MsgType: types.TokenMsgType,
		Num:     n,
	}
}

func createErrorMsg(msg string) types.StreamedMessage {
	return types.StreamedMessage{
		Content: msg,
		MsgType: types.ErrorMsgType,
	}
}
