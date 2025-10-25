package main

import (
	"errors"
	"net/http"

	"dbtsr.isez.dev/internal/domain"
	"dbtsr.isez.dev/internal/validator"
)

func (app *application) createOwnerHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for creating an owner
	var input struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	owner := &domain.Owner{
		Name:  input.Name,
		Email: input.Email,
	}

	v := validator.New()

	if domain.ValidateOwner(v, owner); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Owners.Insert(owner)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"owner": owner}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getOwnerHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for getting an owner
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	owner, err := app.models.Owners.Get(id)
	if err != nil {
		switch {
		case err == domain.ErrRecordNotFound:
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"owner": owner}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) getOwnersHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for getting all owners
	owners, err := app.models.Owners.List()
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"owners": owners}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) updateOwnerHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for updating an owner
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	owner, err := app.models.Owners.Get(id)
	if err != nil {
		switch {
		case err == domain.ErrRecordNotFound:
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	var input struct {
		Name  *string `json:"name"`
		Email *string `json:"email"`
	}

	err = app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	if input.Name != nil {
		owner.Name = *input.Name
	}
	if input.Email != nil {
		owner.Email = *input.Email
	}

	v := validator.New()

	if domain.ValidateOwner(v, owner); !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	err = app.models.Owners.Update(owner)
	if err != nil {
		switch {
			case errors.Is(err, domain.ErrEditConflict):
				app.editConflictResponse(w, r)
			default:
				app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"owner": owner}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

func (app *application) deleteOwnerHandler(w http.ResponseWriter, r *http.Request) {
	// Implementation for deleting an owner
	id, err := app.readIDParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Owners.Delete(id)
	if err != nil {
		switch {
		case err == domain.ErrRecordNotFound:
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": "owner successfully deleted"}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}