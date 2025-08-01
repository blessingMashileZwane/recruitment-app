import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const config = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	user: process.env.DB_USER || "postgres",
	password: process.env.DB_PASSWORD || "password",
	database: process.env.DB_NAME || "recruitment_db",
};

async function checkDbState() {
	const client = new Client(config);

	try {
		await client.connect();

		// Check if schema exists
		const schemaQuery = `
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name = 'recruitment';
        `;
		const schemaResult = await client.query(schemaQuery);
		console.log("Schema exists:", schemaResult.rows.length > 0);

		if (schemaResult.rows.length > 0) {
			// Check remaining tables
			const tablesQuery = `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'recruitment'
                ORDER BY table_name;
            `;
			const tablesResult = await client.query(tablesQuery);
			console.log("\nRemaining tables:");
			tablesResult.rows.forEach((row) => console.log(`- ${row.table_name}`));

			// Check remaining types
			const typesQuery = `
                SELECT t.typname
                FROM pg_type t
                JOIN pg_namespace n ON t.typnamespace = n.oid
                WHERE n.nspname = 'recruitment'
                AND t.typtype = 'e'
                ORDER BY t.typname;
            `;
			const typesResult = await client.query(typesQuery);
			console.log("\nRemaining enum types:");
			typesResult.rows.forEach((row) => console.log(`- ${row.typname}`));
		}
	} catch (error) {
		console.error("Error checking database state:", error);
	} finally {
		await client.end();
	}
}

checkDbState();
