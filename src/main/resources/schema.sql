-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    duration_minutes INT NOT NULL,
    total_marks INT NOT NULL,
    passing_percentage INT NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_text VARCHAR(1000) NOT NULL,
    question_type VARCHAR(20) NOT NULL,
    correct_answer VARCHAR(1000) NOT NULL,
    marks INT NOT NULL,
    exam_id INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Create question_options table for MCQ options
CREATE TABLE IF NOT EXISTS question_options (
    question_id INT NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    total_marks INT NOT NULL,
    obtained_marks INT NOT NULL,
    percentage DOUBLE NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken_in_seconds INT,
    submitted_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Insert default admin user
INSERT INTO users (name, username, password, email, role, created_at)
VALUES ('Admin User', 'admin', '$2a$10$1/fkAQ2QWfFtccvRFUK7Tu2dfLLt4VNqwGnLjBWoAqI5D.jW3IhpO', 'admin@example.com', 'ADMIN', CURRENT_TIMESTAMP);
