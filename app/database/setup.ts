import mysql from "mysql";
import {readFile} from "fs/promises";

const setupPool = mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT ?? 3306),
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true,
})

function makeSetupQuery(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
        setupPool.getConnection((err, connection) => {
            if (err) {
                console.error("Error connecting to the database:", err);
                reject(err);
                return;
            }
            connection.query(query, (err) => {
                if (err) reject(err);
                else resolve();
            });
        })
    });
}

(async () => {
    try {
        const sql = await readFile("setup.sql", "utf-8");
        await makeSetupQuery(sql);
        console.log("Database schema initialized successfully.");
    } catch (err) {
        console.error("Error initializing database:", err);
    } finally {
        setupPool.end();
    }
})();