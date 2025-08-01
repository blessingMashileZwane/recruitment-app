import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "../../.env" });

interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

async function initDatabase() {
	const config: DatabaseConfig = {
		host: process.env.DB_HOST || "localhost",
		port: parseInt(process.env.DB_PORT || "5432"),
		user: process.env.DB_USER || "postgres",
		password: process.env.DB_PASSWORD || "password",
		database: process.env.DB_NAME || "recruitment_db",
	};

	const client = new Client(config);

	try {
		await client.connect();

		await client.query("SET search_path TO recruitment, public");

		const initSQL = fs.readFileSync(
			path.join(__dirname, "../migrations/001.sql"),
			"utf8"
		);
		await client.query(initSQL);

		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Error initializing database:", error);
		process.exit(1);
	} finally {
		await client.end();
	}
}

initDatabase();
