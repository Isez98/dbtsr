package main

import (
	"github.com/go-chi/chi/v5"
)

func (app *application) routes() *chi.Mux {
	router := chi.NewRouter()

	router.NotFound(app.notFoundResponse)
	router.MethodNotAllowed(app.methodNotAllowedResponse)

	router.Get("/v1/healthcheck", app.healthcheckHandler)

	router.Post("/v1/owners", app.createOwnerHandler)
	router.Get("/v1/owners", app.getOwnersHandler)
	router.Get("/v1/owners/{id}", app.getOwnerHandler)
	router.Patch("/v1/owners/{id}", app.updateOwnerHandler)
	router.Delete("/v1/owners/{id}", app.deleteOwnerHandler)

	return router
}