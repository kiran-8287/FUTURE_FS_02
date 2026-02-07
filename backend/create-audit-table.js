const pool = require('./config/database');

/**
 * Migration script to create audit_logs table
 * This table tracks all changes made to leads in the CRM system
 */

const createAuditLogsTable = async () => {
    const client = await pool.connect();

    try {
        console.log('🔧 Creating audit_logs table...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(255),
        details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

        console.log('✅ audit_logs table created successfully');

        // Create index for faster queries
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
      ON audit_logs(created_at DESC);
    `);

        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity 
      ON audit_logs(entity_type, entity_id);
    `);

        console.log('✅ Indexes created successfully');

        // Verify table was created
        const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);

        console.log('\n📋 Table structure:');
        result.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type}`);
        });

        console.log('\n✅ Migration completed successfully!');

    } catch (error) {
        console.error('❌ Error creating audit_logs table:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

// Run migration
createAuditLogsTable()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
