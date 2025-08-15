import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditFields1692123456789 implements MigrationInterface {
	name = "AddAuditFields1692123456789";

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add audit columns to candidate table if they don't exist
		await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate' AND column_name = 'createdBy') THEN
                    ALTER TABLE "candidate" ADD COLUMN "createdBy" varchar;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate' AND column_name = 'updatedBy') THEN
                    ALTER TABLE "candidate" ADD COLUMN "updatedBy" varchar;
                END IF;
            END $$;
        `);

		// Add audit columns to candidate_skills table if they don't exist
		await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate_skills' AND column_name = 'createdBy') THEN
                    ALTER TABLE "candidate_skills" ADD COLUMN "createdBy" varchar;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate_skills' AND column_name = 'updatedBy') THEN
                    ALTER TABLE "candidate_skills" ADD COLUMN "updatedBy" varchar;
                END IF;
            END $$;
        `);

		// Add audit columns to job_applications table if they don't exist
		await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'job_applications' AND column_name = 'createdBy') THEN
                    ALTER TABLE "job_applications" ADD COLUMN "createdBy" varchar;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'job_applications' AND column_name = 'updatedBy') THEN
                    ALTER TABLE "job_applications" ADD COLUMN "updatedBy" varchar;
                END IF;
            END $$;
        `);

		// Add audit columns to interview_stages table if they don't exist
		await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'interview_stages' AND column_name = 'createdBy') THEN
                    ALTER TABLE "interview_stages" ADD COLUMN "createdBy" varchar;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'interview_stages' AND column_name = 'updatedBy') THEN
                    ALTER TABLE "interview_stages" ADD COLUMN "updatedBy" varchar;
                END IF;
            END $$;
        `);

		// Add audit columns to candidate_history table if they don't exist
		await queryRunner.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate_history' AND column_name = 'createdBy') THEN
                    ALTER TABLE "candidate_history" ADD COLUMN "createdBy" varchar;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'candidate_history' AND column_name = 'updatedBy') THEN
                    ALTER TABLE "candidate_history" ADD COLUMN "updatedBy" varchar;
                END IF;
            END $$;
        `);

		// Update existing records with default values
		await queryRunner.query(
			`UPDATE "candidate" SET "createdBy" = 'system' WHERE "createdBy" IS NULL`
		);
		await queryRunner.query(
			`UPDATE "candidate" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL`
		);

		await queryRunner.query(
			`UPDATE "candidate_skills" SET "createdBy" = 'system' WHERE "createdBy" IS NULL`
		);
		await queryRunner.query(
			`UPDATE "candidate_skills" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL`
		);

		await queryRunner.query(
			`UPDATE "job_applications" SET "createdBy" = 'system' WHERE "createdBy" IS NULL`
		);
		await queryRunner.query(
			`UPDATE "job_applications" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL`
		);

		await queryRunner.query(
			`UPDATE "interview_stages" SET "createdBy" = 'system' WHERE "createdBy" IS NULL`
		);
		await queryRunner.query(
			`UPDATE "interview_stages" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL`
		);

		await queryRunner.query(
			`UPDATE "candidate_history" SET "createdBy" = 'system' WHERE "createdBy" IS NULL`
		);
		await queryRunner.query(
			`UPDATE "candidate_history" SET "updatedBy" = 'system' WHERE "updatedBy" IS NULL`
		);

		// Make columns NOT NULL
		await queryRunner.query(
			`ALTER TABLE "candidate" ALTER COLUMN "createdBy" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate" ALTER COLUMN "updatedBy" SET NOT NULL`
		);

		await queryRunner.query(
			`ALTER TABLE "candidate_skills" ALTER COLUMN "createdBy" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_skills" ALTER COLUMN "updatedBy" SET NOT NULL`
		);

		await queryRunner.query(
			`ALTER TABLE "job_applications" ALTER COLUMN "createdBy" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "job_applications" ALTER COLUMN "updatedBy" SET NOT NULL`
		);

		await queryRunner.query(
			`ALTER TABLE "interview_stages" ALTER COLUMN "createdBy" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_stages" ALTER COLUMN "updatedBy" SET NOT NULL`
		);

		await queryRunner.query(
			`ALTER TABLE "candidate_history" ALTER COLUMN "createdBy" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_history" ALTER COLUMN "updatedBy" SET NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Remove audit columns
		await queryRunner.query(
			`ALTER TABLE "candidate_history" DROP COLUMN IF EXISTS "updatedBy"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_history" DROP COLUMN IF EXISTS "createdBy"`
		);

		await queryRunner.query(
			`ALTER TABLE "interview_stages" DROP COLUMN IF EXISTS "updatedBy"`
		);
		await queryRunner.query(
			`ALTER TABLE "interview_stages" DROP COLUMN IF EXISTS "createdBy"`
		);

		await queryRunner.query(
			`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "updatedBy"`
		);
		await queryRunner.query(
			`ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "createdBy"`
		);

		await queryRunner.query(
			`ALTER TABLE "candidate_skills" DROP COLUMN IF EXISTS "updatedBy"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate_skills" DROP COLUMN IF EXISTS "createdBy"`
		);

		await queryRunner.query(
			`ALTER TABLE "candidate" DROP COLUMN IF EXISTS "updatedBy"`
		);
		await queryRunner.query(
			`ALTER TABLE "candidate" DROP COLUMN IF EXISTS "createdBy"`
		);
	}
}
