package main

import (
	"fmt"
	"net/http"
)

const version = "1.0.0"

func (app *application) healthcheckHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "status: available")
  fmt.Fprintf(w, "environment: %s\n", app.config.env)
  fmt.Fprintf(w, "version: %s\n", version)
}