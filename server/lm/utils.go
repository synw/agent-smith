package lm

import (
	"fmt"
	"reflect"
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
