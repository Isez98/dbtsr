CREATE TABLE IF NOT EXISTS properties (
  id bigserial PRIMARY KEY,  
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  address text NOT NULL,
  owner_id bigint NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  rate numeric(10,2) NOT NULL,
  version integer NOT NULL DEFAULT 1
);