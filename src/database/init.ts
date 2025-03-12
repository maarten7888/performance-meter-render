import { db } from './db';

const createTables = async () => {
    try {
        // Create projects table
        await db.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                hourly_rate DECIMAL(10, 2) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating database tables:', error);
        throw error;
    }
};

export const initializeDatabase = async () => {
    try {
        await createTables();
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}; 