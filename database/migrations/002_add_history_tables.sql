-- Add missing history tables
SET search_path TO recruitment, public;

-- Create SkillHistory table
CREATE TABLE skill_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id UUID REFERENCES skills(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    changed_by UUID,
    previous_name VARCHAR(100),
    new_name VARCHAR(100),
    previous_category VARCHAR(100),
    new_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create JobPositionHistory table
CREATE TABLE job_position_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_position_id UUID REFERENCES job_positions(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    changed_by UUID,
    previous_title VARCHAR(255),
    new_title VARCHAR(255),
    previous_department VARCHAR(100),
    new_department VARCHAR(100),
    previous_description TEXT,
    new_description TEXT,
    previous_requirements TEXT,
    new_requirements TEXT,
    previous_is_active BOOLEAN,
    new_is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create InterviewStageHistory table
CREATE TABLE interview_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID REFERENCES interview_stages(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    changed_by UUID,
    previous_name VARCHAR(100),
    new_name VARCHAR(100),
    previous_description TEXT,
    new_description TEXT,
    previous_order_index INTEGER,
    new_order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create CandidateSkillHistory table
CREATE TABLE candidate_skill_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_skill_id UUID REFERENCES candidate_skills(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    changed_by UUID,
    previous_years_of_experience INTEGER,
    new_years_of_experience INTEGER,
    previous_proficiency_level INTEGER,
    new_proficiency_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
