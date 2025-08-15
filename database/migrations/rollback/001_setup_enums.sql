-- Convert the columns back to text
ALTER TABLE candidate ALTER COLUMN status TYPE TEXT USING status::TEXT;
ALTER TABLE candidate_history ALTER COLUMN status TYPE TEXT USING status::TEXT;

-- Drop the new enum type
DROP TYPE IF EXISTS candidate_status CASCADE;

-- Create the old enum type
CREATE TYPE candidate_status AS ENUM ('active', 'hired', 'rejected', 'withdrawn');

-- Update the data
UPDATE candidate 
SET status = CASE 
    WHEN status = 'open' THEN 'active'
    ELSE 'withdrawn'
END;

UPDATE candidate_history 
SET status = CASE 
    WHEN status = 'open' THEN 'active'
    ELSE 'withdrawn'
END;

-- Convert columns to use the old enum
ALTER TABLE candidate 
    ALTER COLUMN status TYPE candidate_status USING status::candidate_status,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN status SET DEFAULT 'active';

ALTER TABLE candidate_history 
    ALTER COLUMN status TYPE candidate_status USING status::candidate_status,
    ALTER COLUMN status SET DEFAULT 'active';
