import mysql from "mysql";
import {readFile} from "fs/promises";

const setupPool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
})

function makeSetupQuery(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
        setupPool.query(query, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

(async () => {
    try {
        const sql = await readFile("schema.sql", "utf-8");
        await makeSetupQuery(sql);
        console.log("Database schema initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        setupPool.end();
    }
})();