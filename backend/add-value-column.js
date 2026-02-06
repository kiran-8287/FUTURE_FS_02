const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
    try {
        console.log('🔄 Starting migration: Add value column to leads...');

        // 1. Add column if not exists
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='value') THEN 
                    ALTER TABLE leads ADD COLUMN value NUMERIC DEFAULT 0; 
                END IF; 
            END $$;
        `);
        console.log('✅ Column checked/added.');

        // 2. Populate existing leads with random values where value is 0 or null
        const updateResult = await pool.query(`
            UPDATE leads 
            SET value = floor(random() * 490000 + 10000) 
            WHERE value IS NULL OR value = 0
        `);
        console.log(`✅ Updated ${updateResult.rowCount} leads with random values.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrate();
