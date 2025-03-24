import { pool } from '../config/database';

async function testDatabase() {
    try {
        console.log('[Test] Testing database connection...');
        
        // Test 1: Basis connectie
        const connection = await pool.getConnection();
        console.log('[Test] Database connection successful');
        connection.release();

        // Test 2: Consultants tabel
        const [tables] = await pool.query('SHOW TABLES');
        console.log('[Test] Available tables:', tables);

        // Test 3: Consultants data
        const [consultants] = await pool.query('SELECT * FROM consultants');
        console.log('[Test] Consultants data:', consultants);

        console.log('[Test] All tests completed successfully');
    } catch (error) {
        console.error('[Test] Error:', error);
    } finally {
        await pool.end();
    }
}

testDatabase(); 