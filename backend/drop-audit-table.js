const pool = require('./config/database');
require('dotenv').config();

const dropAuditTable = async () => {
    try {
        console.log('🔧 Dropping audit_logs table...');
        await pool.query('DROP TABLE IF EXISTS audit_logs CASCADE;');
        console.log('✅ audit_logs table dropped successfully');
    } catch (error) {
        console.error('❌ Error dropping audit_logs table:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

dropAuditTable();
