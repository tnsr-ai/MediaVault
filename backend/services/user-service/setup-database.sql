-- Connect to PostgreSQL as superuser and run these commands:

-- Create database
CREATE DATABASE mediavault;

-- Create user
CREATE USER mediavault_user WITH PASSWORD 'mediavault_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mediavault TO mediavault_user;

-- Connect to the mediavault database and grant schema privileges
\c mediavault;
GRANT ALL ON SCHEMA public TO mediavault_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mediavault_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mediavault_user;
