-- Drop all tables in the recruitment schema in correct dependency order
DROP TABLE IF EXISTS recruitment.applications CASCADE;

-- Drop history tables first
DROP TABLE IF EXISTS recruitment.interview_progress_history CASCADE;
DROP TABLE IF EXISTS recruitment.interview_stage_history CASCADE;
DROP TABLE IF EXISTS recruitment.job_position_history CASCADE;
DROP TABLE IF EXISTS recruitment.candidate_skill_history CASCADE;
DROP TABLE IF EXISTS recruitment.skill_history CASCADE;
DROP TABLE IF EXISTS recruitment.candidate_history CASCADE;

-- Drop main tables next
DROP TABLE IF EXISTS recruitment.interview_progress CASCADE;
DROP TABLE IF EXISTS recruitment.candidate_skills CASCADE;
DROP TABLE IF EXISTS recruitment.interview_stages CASCADE;
DROP TABLE IF EXISTS recruitment.job_positions CASCADE;
DROP TABLE IF EXISTS recruitment.skills CASCADE;
DROP TABLE IF EXISTS recruitment.candidates CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS recruitment.interview_status;
DROP TYPE IF EXISTS recruitment.candidate_status;

-- Drop functions
DROP FUNCTION IF EXISTS recruitment.update_updated_at_column();

-- Finally drop the schema
DROP SCHEMA IF EXISTS recruitment CASCADE;

-- Verify that the schema and all its objects are gone
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'recruitment') THEN
        RAISE EXCEPTION 'Schema recruitment still exists';
    END IF;
END
$$;
