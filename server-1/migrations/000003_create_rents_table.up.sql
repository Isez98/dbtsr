CREATE TABLE IF NOT EXISTS rents (
    id bigserial PRIMARY KEY,  
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    property_id bigint NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    price numeric(10,2) NOT NULL,
    version integer NOT NULL DEFAULT 1
);