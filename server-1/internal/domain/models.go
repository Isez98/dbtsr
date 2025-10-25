package domain

import (
	"database/sql"
	"errors"
)

var (
	ErrRecordNotFound = errors.New("record not found")
	ErrInvalidID      = errors.New("invalid ID")
	ErrDuplicateEmail = errors.New("duplicate email")
	ErrInternalServer  = errors.New("internal server error")
	ErrEditConflict    = errors.New("edit conflict")
)

type Models struct {
	Owners OwnerModelInterface
}

func NewModels(db *sql.DB) Models {
	return Models{
		Owners: &OwnerModel{DB: db},
	}
}