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

async function seed() {
	const client = new Client(config);

	try {
		await client.connect();

		// Set search path to our schema
		await client.query("SET search_path TO recruitment, public");

		// Read and execute the seed.sql file
		const seedSQL = fs.readFileSync(
			path.join(__dirname, "../seed/seed.sql"),
			"utf8"
		);

		// Run seeding in a transaction
		await client.query("BEGIN");
		try {
			await client.query(seedSQL);
			await client.query("COMMIT");
			console.log("Database seeded successfully");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

seed();
