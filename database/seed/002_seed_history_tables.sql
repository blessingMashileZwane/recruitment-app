-- Seed data for the new history tables

-- Seed skill history
INSERT INTO skill_history (skill_id, action, description, changed_by)
SELECT 
    id,
    'CREATED',
    'Skill created',
    (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM skills;

-- Seed job position history
INSERT INTO job_position_history (job_position_id, action, description, changed_by)
SELECT 
    id,
    'CREATED',
    'Job position created',
    (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM job_positions;

-- Seed interview stage history
INSERT INTO interview_stage_history (stage_id, action, description, changed_by)
SELECT 
    id,
    'CREATED',
    'Interview stage created',
    (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM interview_stages;

-- Seed candidate skill history
INSERT INTO candidate_skill_history (candidate_skill_id, action, description, changed_by)
SELECT 
    id,
    'CREATED',
    'Candidate skill association created',
    (SELECT id FROM users ORDER BY random() LIMIT 1)
FROM candidate_skills;
