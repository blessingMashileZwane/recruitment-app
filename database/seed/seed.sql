-- Seed data for the recruitment app

-- Insert users (recruiters/admins)
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@company.com', '$2b$10$zNT/VMI1t8xIhBY1UL0xL.1XB6XzOA3N7LD/CylNtU8CTCwNHn8PK'),  -- password: admin123
('recruiter1', 'recruiter1@company.com', '$2b$10$zNT/VMI1t8xIhBY1UL0xL.1XB6XzOA3N7LD/CylNtU8CTCwNHn8PK'),
('recruiter2', 'recruiter2@company.com', '$2b$10$zNT/VMI1t8xIhBY1UL0xL.1XB6XzOA3N7LD/CylNtU8CTCwNHn8PK');

-- Insert skills with categories
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'Programming Languages'),
('TypeScript', 'Programming Languages'),
('Python', 'Programming Languages'),
('Java', 'Programming Languages'),
('C#', 'Programming Languages'),
-- Frontend
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('HTML5', 'Frontend'),
('CSS3', 'Frontend'),
('SASS/SCSS', 'Frontend'),
-- Backend
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('Spring Boot', 'Backend'),
('.NET Core', 'Backend'),
-- Database
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('MySQL', 'Database'),
('Redis', 'Database'),
-- DevOps
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Jenkins', 'DevOps'),
('GitHub Actions', 'DevOps'),
-- Cloud
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Google Cloud', 'Cloud'),
-- Testing
('Jest', 'Testing'),
('Cypress', 'Testing'),
('JUnit', 'Testing'),
-- Soft Skills
('Communication', 'Soft Skills'),
('Leadership', 'Soft Skills'),
('Problem Solving', 'Soft Skills'),
('Team Collaboration', 'Soft Skills');

-- Insert interview stages
INSERT INTO interview_stages (name, description, order_index) VALUES
('Resume Screening', 'Initial review of candidate qualifications', 1),
('Technical Assessment', 'Online coding assessment and technical questions', 2),
('Technical Interview', 'In-depth technical discussion with senior developers', 3),
('Team Fit', 'Meeting with potential team members', 4),
('Culture Fit', 'Evaluation of cultural alignment and soft skills', 5),
('Final Interview', 'Final discussion with senior management', 6),
('HR Discussion', 'Discussion of compensation and benefits', 7);

-- Insert job positions
INSERT INTO job_positions (title, department, description, requirements, is_active) VALUES
('Senior Full Stack Developer', 'Engineering', 
 'We are looking for a Senior Full Stack Developer to join our engineering team and help build scalable applications.',
 'Experience with React, Node.js, and cloud technologies required. Min 5 years of experience.',
 true),
('Frontend Developer', 'Engineering',
 'Looking for a Frontend Developer with strong React skills to join our team.',
 'Strong experience with React, TypeScript, and modern frontend development practices.',
 true),
('Backend Developer', 'Engineering',
 'Seeking a Backend Developer to help build and maintain our server infrastructure.',
 'Experience with Node.js, PostgreSQL, and RESTful APIs required.',
 true),
('DevOps Engineer', 'Operations',
 'Looking for a DevOps Engineer to improve our deployment and infrastructure processes.',
 'Experience with Docker, Kubernetes, and cloud platforms required.',
 true),
('QA Engineer', 'Quality Assurance',
 'Seeking a QA Engineer to ensure the quality of our applications.',
 'Experience with automated testing frameworks and quality assurance processes.',
 true);

-- Insert sample candidates
INSERT INTO candidates (first_name, last_name, email, phone, current_location, citizenship, status, resume_url) VALUES
('John', 'Doe', 'john.doe@email.com', '+1234567890', 'New York, USA', 'USA', 'active', 'https://storage.example.com/resumes/john-doe.pdf'),
('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', 'London, UK', 'UK', 'active', 'https://storage.example.com/resumes/jane-smith.pdf'),
('Alice', 'Johnson', 'alice.j@email.com', '+1234567892', 'Toronto, Canada', 'Canada', 'active', 'https://storage.example.com/resumes/alice-johnson.pdf'),
('Bob', 'Wilson', 'bob.wilson@email.com', '+1234567893', 'Sydney, Australia', 'Australia', 'active', 'https://storage.example.com/resumes/bob-wilson.pdf'),
('Carol', 'Brown', 'carol.brown@email.com', '+1234567894', 'Berlin, Germany', 'Germany', 'active', 'https://storage.example.com/resumes/carol-brown.pdf');

-- Insert candidate skills (with varying experience levels)
WITH candidate_ids AS (SELECT id FROM candidates),
     skill_ids AS (SELECT id FROM skills)
INSERT INTO candidate_skills (candidate_id, skill_id, years_of_experience, proficiency_level)
SELECT 
    c.id,
    s.id,
    floor(random() * 10 + 1)::int,  -- 1-10 years of experience
    floor(random() * 3 + 3)::int    -- 3-5 proficiency level
FROM candidates c
CROSS JOIN LATERAL (
    SELECT id FROM skills 
    ORDER BY random() 
    LIMIT floor(random() * 10 + 5)::int  -- Each candidate gets 5-15 random skills
) s;

-- Insert interview progress for candidates
WITH candidate_positions AS (
    SELECT 
        c.id as candidate_id,
        jp.id as position_id
    FROM candidates c
    CROSS JOIN LATERAL (
        SELECT id FROM job_positions 
        ORDER BY random() 
        LIMIT floor(random() * 2 + 1)::int  -- Each candidate applies to 1-3 positions
    ) jp
)
INSERT INTO interview_progress (
    candidate_id,
    job_position_id,
    stage_id,
    status,
    scheduled_date,
    feedback,
    score
)
SELECT 
    cp.candidate_id,
    cp.position_id,
    s.id as stage_id,
    CASE floor(random() * 4)::int
        WHEN 0 THEN 'scheduled'
        WHEN 1 THEN 'completed'
        WHEN 2 THEN 'cancelled'
        ELSE 'pending'
    END as status,
    CASE WHEN random() > 0.5 
        THEN NOW() + (random() * interval '30 days')
        ELSE NULL 
    END as scheduled_date,
    CASE WHEN random() > 0.7
        THEN 'Sample feedback for the interview stage'
        ELSE NULL
    END as feedback,
    CASE WHEN random() > 0.5
        THEN floor(random() * 40 + 60)::int  -- Score between 60-100
        ELSE NULL
    END as score
FROM candidate_positions cp
CROSS JOIN LATERAL (
    SELECT id FROM interview_stages
    ORDER BY order_index
    LIMIT floor(random() * 3 + 1)::int  -- Each candidate is in 1-3 stages
) s;

-- Insert some history records
INSERT INTO interview_progress_history (
    interview_progress_id,
    previous_status,
    new_status,
    previous_stage_id,
    new_stage_id,
    changed_by,
    notes
)
SELECT 
    ip.id,
    'pending',
    ip.status,
    NULL,
    ip.stage_id,
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    'Initial interview stage set'
FROM interview_progress ip
WHERE ip.status != 'pending';

-- Insert candidate history
INSERT INTO candidate_history (
    candidate_id,
    action,
    description,
    changed_by,
    previous_status,
    new_status
)
SELECT 
    id,
    'CREATED',
    'Candidate profile created',
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    NULL,
    'active'
FROM candidates;