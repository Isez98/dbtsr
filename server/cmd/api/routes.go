package main

import (
	"github.com/go-chi/chi/v5"
)

func (app *application) routes() *chi.Mux {
	router := chi.NewRouter()

	// Global middleware
	router.NotFound(app.notFoundResponse)
	router.MethodNotAllowed(app.methodNotAllowedResponse)

	// Healthcheck route
	router.Get("/v1/healthcheck", app.healthcheckHandler)

	// Owner routes
	router.Post("/v1/owners", app.createOwnerHandler)
	router.Get("/v1/owners", app.getOwnersHandler)
	router.Get("/v1/owners/{id}", app.getOwnerHandler)
	router.Patch("/v1/owners/{id}", app.updateOwnerHandler)
	router.Delete("/v1/owners/{id}", app.deleteOwnerHandler)

	// OCR routes
	router.Post("/v1/extract", app.ocrHandler)

	return router
}