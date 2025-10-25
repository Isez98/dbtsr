package domain

import (
	"context"
	"database/sql"
	"time"

	"dbtsr.isez.dev/internal/validator"
)

type Owner struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type OwnerModel struct {
	DB *sql.DB
}

type OwnerModelInterface interface {
	Get(id int64) (*Owner, error)
	Insert(owner *Owner) error
	Update(owner *Owner) error
	Delete(id int64) error
	List() ([]*Owner, error)
}

func (m *OwnerModel) Insert(owner *Owner) error {
	query := `
		INSERT INTO owners (name, email, created_at, updated_at)
		VALUES ($1, $2, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	args := []any{
		owner.Name,
		owner.Email,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return m.DB.QueryRowContext(ctx, query, args...).Scan(
		&owner.ID,
		&owner.CreatedAt,
		&owner.UpdatedAt,
	)
}

func (m *OwnerModel) Get(id int64) (*Owner, error) {
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	query := `
		SELECT id, name, email, created_at, updated_at
		FROM owners
		WHERE id = $1
	`

	var owner Owner

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&owner.ID,
		&owner.Name,
		&owner.Email,
		&owner.CreatedAt,
		&owner.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrRecordNotFound
		}
		return nil, err
	}

	return &owner, nil
}

func (m *OwnerModel) Update(owner *Owner) error {
	query := `
		UPDATE owners
		SET name = $1, email = $2, updated_at = NOW()
		WHERE id = $3
		RETURNING updated_at
	`

	args := []any{
		owner.Name,
		owner.Email,
		owner.ID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&owner.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return ErrRecordNotFound
		}
		return err
	}

	return nil
}

func (m *OwnerModel) Delete(id int64) error {
	query := `
		DELETE FROM owners
		WHERE id = $1
	`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	result, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (m *OwnerModel) List() ([]*Owner, error)	 {
	query := `
		SELECT id, name, email, created_at, updated_at
		FROM owners
	`

	var owners []*Owner

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var owner Owner
		if err := rows.Scan(
			&owner.ID,
			&owner.Name,
			&owner.Email,
			&owner.CreatedAt,
			&owner.UpdatedAt,
		); err != nil {
			return nil, err
		}
		owners = append(owners, &owner)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return owners, nil
}

func ValidateOwner(v *validator.Validator, owner *Owner) {
	v.Check(owner.Name != "", "name", "must be provided")
	v.Check(len(owner.Name) <= 100, "name", "must not be more than 100 bytes long")

	v.Check(owner.Email != "", "email", "must be provided")
	v.Check(len(owner.Email) <= 100, "email", "must not be more than 100 bytes long")
	v.Check(validator.Matches(owner.Email, validator.EmailRX), "email", "must be a valid email address")
}