-- ================================================
-- User Management System - Database Setup Script
-- ================================================

-- Create database
CREATE DATABASE IF NOT EXISTS usermanagement;

-- Use the database
USE usermanagement;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_department (department),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO users (name, email, role, department) VALUES
('John Doe', 'john@example.com', 'Developer', 'Engineering'),
('Jane Smith', 'jane@example.com', 'Designer', 'Design'),
('Bob Johnson', 'bob@example.com', 'Manager', 'Operations'),
('Alice Williams', 'alice@example.com', 'Developer', 'Engineering'),
('Charlie Brown', 'charlie@example.com', 'Analyst', 'Analytics'),
('Diana Prince', 'diana@example.com', 'HR Manager', 'HR'),
('Ethan Hunt', 'ethan@example.com', 'Security', 'Operations'),
('Fiona Clark', 'fiona@example.com', 'Developer', 'Engineering'),
('George Martin', 'george@example.com', 'Writer', 'Content'),
('Hannah Lee', 'hannah@example.com', 'Designer', 'Design'),
('Ian Malcolm', 'ian@example.com', 'Scientist', 'Research'),
('Julia Roberts', 'julia@example.com', 'Sales', 'Sales'),
('Kevin Hart', 'kevin@example.com', 'Marketing', 'Marketing'),
('Laura Croft', 'laura@example.com', 'Archaeologist', 'Research'),
('Michael Scott', 'michael@example.com', 'Regional Manager', 'Management');

-- Verify data insertion
SELECT COUNT(*) as total_users FROM users;

-- Display all users
SELECT * FROM users ORDER BY created_at DESC;

-- Display users by department
SELECT department, COUNT(*) as count 
FROM users 
GROUP BY department 
ORDER BY count DESC;

-- ================================================
-- Useful Queries for Testing
-- ================================================

-- Get paginated results (page 1, 10 items)
-- SELECT * FROM users ORDER BY created_at DESC LIMIT 10 OFFSET 0;

-- Search users
-- SELECT * FROM users 
-- WHERE name LIKE '%john%' 
--    OR email LIKE '%john%' 
--    OR role LIKE '%john%' 
--    OR department LIKE '%john%';

-- Get user count by department
-- SELECT department, COUNT(*) as count 
-- FROM users 
-- GROUP BY department;

-- Find duplicate emails (should be none due to UNIQUE constraint)
-- SELECT email, COUNT(*) as count 
-- FROM users 
-- GROUP BY email 
-- HAVING count > 1;

-- ================================================
-- Cleanup Queries (Use with caution!)
-- ================================================

-- Drop all data from users table
-- TRUNCATE TABLE users;

-- Drop users table
-- DROP TABLE users;

-- Drop database
-- DROP DATABASE usermanagement;
