import mySQL, {FieldInfo} from "mysql";

export const db = mySQL.createPool({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    multipleStatements: true,
});

export async function makeDBQuery<T>(query: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error("Error connecting to the database:", err);
                reject(err);
                return;
            }
            connection.query(query, (error, results, fields) => {
                if (error) {
                    console.error("Error executing query:", error);
                    reject(error);
                    return;
                }
                resolve(parseQueryResults(results, fields));
            });
            connection.release();
        });
    });
}




/**
 * Parses MySQL query results into structured data using field metadata
 * @param results Array of MySQL RowDataPacket objects
 * @param fields Array of MySQL field metadata objects
 * @returns Properly structured data based on the query type
 */
export function parseQueryResults<T>(results: Record<string,never>[], fields?: FieldInfo[]): T[] {
    if (!results || !Array.isArray(results) || results.length === 0) {
        return [];
    }
    // For queries, return properly typed objects
    return results.map(row => {
        const cleanRow: Record<string, boolean|Date|null> = {};

        // If we have fields metadata, use it for better parsing
        if (fields && fields.length > 0) {
            fields.forEach(field => {
                const key = field.name;
                let value: boolean|Date|null = row[key];

                // Apply type conversions based on MySQL field types
                switch (field.type) {
                    case 1: // TINY
                        // Convert TINYINT(1) to boolean
                        if (field.length === 1) {
                            value = Boolean(value);
                        }
                        break;
                    case 7: // TIMESTAMP
                    case 12: // DATETIME
                        value = value ? new Date(value) : null;
                        break;
                }

                cleanRow[key] = value;
            });
        } else {
            // No fields metadata, just clean the object
            for (const key in row) {
                if (Object.hasOwn(row, key)) {
                    cleanRow[key] = row[key];
                }
            }
        }

        return cleanRow as T;
    });
}

//setup script for creating the database tables
export async function setupDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createPostsTable = `
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

    await makeDBQuery(createUsersTable);
    await makeDBQuery(createPostsTable);
}
setupDatabase()