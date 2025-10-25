CREATE TABLE IF NOT EXISTS owners (
    id bigserial PRIMARY KEY,  
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    name text NOT NULL,
    email text NOT NULL,
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1
);