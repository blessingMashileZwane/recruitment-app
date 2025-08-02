import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

const config: DatabaseConfig = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	user: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "password",
	database: process.env.DB_NAME || "recruitment_db",
};

async function migrate(direction: "up" | "down") {
	const client = new Client(config);

	try {
		await client.connect();

		if (direction === "down") {
			// Force close all connections to the schema before dropping
			await client.query(
				`
				SELECT pg_terminate_backend(pid)
				FROM pg_stat_activity
				WHERE datname = $1
				AND pid <> pg_backend_pid()
				AND usename = current_user;
			`,
				[config.database]
			);

			// Force drop schema and everything in it
			await client.query("DROP SCHEMA IF EXISTS recruitment CASCADE;");
			console.log("Schema dropped successfully");
			return;
		}

		// For up migrations
		await client.query("CREATE SCHEMA IF NOT EXISTS recruitment;");
		await client.query("SET search_path TO recruitment, public;");

		// Get all migration files
		const migrationFiles = fs
			.readdirSync(path.join(__dirname, "../migrations"))
			.filter((file) => file.endsWith(".sql"))
			.filter((file) => !file.startsWith("rollback"))
			.sort();

		console.log("Applying migrations in order:", migrationFiles);

		const sql = migrationFiles
			.map((file) =>
				fs.readFileSync(path.join(__dirname, "../migrations", file), "utf8")
			)
			.join("\n");

		// Run migrations in a transaction
		await client.query("BEGIN");
		try {
			console.log({ sql });
			await client.query(sql);
			await client.query("COMMIT");
			console.log(`Migration ${direction} completed successfully`);
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	} catch (error) {
		console.error(`Error during migration ${direction}:`, error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

// Get migration direction from command line args
const direction = process.argv[2] as "up" | "down";
if (!direction || !["up", "down"].includes(direction)) {
	console.error("Please specify migration direction: up or down");
	process.exit(1);
}

migrate(direction);
