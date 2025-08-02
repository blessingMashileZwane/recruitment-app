-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set the search path
SET search_path TO recruitment, public;

-- Create enum types
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'pending');
CREATE TYPE candidate_status AS ENUM ('active', 'hired', 'rejected', 'withdrawn');
CREATE TYPE applied_job AS ENUM ('ops', 'finance', 'actuarial', 'recruitment', 'marketing', 'assessor', 'tech', 'other');

-- Create Candidate table
CREATE TABLE candidate (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    current_location VARCHAR(255),
    citizenship VARCHAR(255),
    status candidate_status DEFAULT 'active',
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

-- Create CandidateHistory table
CREATE TABLE candidate_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate(id),
    action VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    current_location VARCHAR(255),
    citizenship VARCHAR(255),
    status candidate_status DEFAULT 'active',
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- Create JobApplication table
CREATE TABLE job_application (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    applied_job applied_job DEFAULT 'other' NOT NULL,
    department VARCHAR(100),
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

-- Create JobApplication history table
CREATE TABLE job_application_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate(id),
    job_application_id UUID REFERENCES job_application(id),
    action VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- Create CandidateSkills table
CREATE TABLE candidate_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate(id),
    university VARCHAR(255),
    qualification VARCHAR(255),
    years_of_experience INTEGER,
    proficiency_level VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    UNIQUE(candidate_id)
);

-- Create CandidateSkills history table
CREATE TABLE candidate_skills_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate(id),
    action VARCHAR(50) NOT NULL,
    candidate_skills_id UUID REFERENCES candidate_skills(id),
    university VARCHAR(255),
    qualification VARCHAR(255),
    years_of_experience INTEGER,
    proficiency_level VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    UNIQUE(candidate_id)
);


-- Create InterviewStages table
CREATE TABLE interview_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    feedback VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

-- Create InterviewStages history table
CREATE TABLE interview_stages_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_stage_id UUID REFERENCES interview_stages(id),
    action VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    feedback VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);


-- Create InterviewProgress table
CREATE TABLE interview_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate(id),
    job_application_id UUID REFERENCES job_application(id),
    stage_id UUID REFERENCES interview_stages(id),
    status interview_status DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL
);

-- Create InterviewProgressHistory table
CREATE TABLE interview_progress_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    interview_progress_id UUID REFERENCES interview_progress(id),
    candidate_id UUID REFERENCES candidate(id),
    job_application_id UUID REFERENCES job_application(id),
    stage_id UUID REFERENCES interview_stages(id),
    status interview_status DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- Add triggers to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to created created_at columns on history tables
CREATE OR REPLACE FUNCTION update_created_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidate_updated_at
    BEFORE UPDATE ON candidate
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_created_at
    BEFORE INSERT ON candidate_history
    FOR EACH ROW
    EXECUTE FUNCTION update_created_at_column();

CREATE TRIGGER update_job_application_updated_at
    BEFORE UPDATE ON job_application
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_application_created_at
    BEFORE INSERT ON job_application_history
    FOR EACH ROW
    EXECUTE FUNCTION update_created_at_column();

CREATE TRIGGER update_candidate_skills_updated_at
    BEFORE UPDATE ON candidate_skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_skills_created_at
    BEFORE INSERT ON candidate_skills_history
    FOR EACH ROW
    EXECUTE FUNCTION update_created_at_column();

CREATE TRIGGER update_interview_stages_updated_at
    BEFORE UPDATE ON interview_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_stages_created_at
    BEFORE INSERT ON interview_stages_history
    FOR EACH ROW
    EXECUTE FUNCTION update_created_at_column();

CREATE TRIGGER update_interview_progress_updated_at
    BEFORE UPDATE ON interview_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_progress_created_at
    BEFORE INSERT ON interview_progress_history
    FOR EACH ROW
    EXECUTE FUNCTION update_created_at_column();
