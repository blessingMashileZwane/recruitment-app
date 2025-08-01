-- This file contains SQL commands to seed the database with initial data.

INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', 'password123'),
('Jane Smith', 'jane@example.com', 'password456');

INSERT INTO jobs (title, description, company_id) VALUES
('Software Engineer', 'Develop and maintain software applications.', 1),
('Product Manager', 'Lead product development and strategy.', 2);

INSERT INTO companies (name, location) VALUES
('Tech Corp', 'New York, NY'),
('Business Inc', 'San Francisco, CA');