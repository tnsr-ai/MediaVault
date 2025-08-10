-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cognito_user_id VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    storage_quota_bytes BIGINT NOT NULL DEFAULT 10737418240, -- Default 10 GB
    storage_used_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON COLUMN users.cognito_user_id IS 'The sub claim from the Cognito JWT';
COMMENT ON COLUMN users.storage_quota_bytes IS 'Storage quota in bytes (default 10 GB)';
COMMENT ON COLUMN users.storage_used_bytes IS 'Current storage usage in bytes';

-- Create indexes for better performance
CREATE INDEX idx_users_cognito_user_id ON users(cognito_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
