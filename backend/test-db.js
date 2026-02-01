// Test script to verify database connection
const pool = require('./config/database');

async function testConnection() {
    console.log('🔍 Testing database connection...\n');

    try {
        // Test basic connection
        const client = await pool.connect();
        console.log('✅ Successfully connected to database!');

        // Test query
        const result = await client.query('SELECT NOW()');
        console.log('✅ Database query successful!');
        console.log('   Server time:', result.rows[0].now);

        // Test tables exist
        const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log('\n📊 Available tables:');
        tables.rows.forEach(row => {
            console.log('   -', row.table_name);
        });

        // Test admin user exists
        const adminCheck = await client.query('SELECT email FROM admin_users LIMIT 1');
        if (adminCheck.rows.length > 0) {
            console.log('\n✅ Admin user found:', adminCheck.rows[0].email);
        } else {
            console.log('\n⚠️  No admin users found in database');
        }

        client.release();
        console.log('\n✅ All tests passed! Database is ready.');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Database connection test failed:');
        console.error('   Error:', error.message);
        console.error('\n🔧 Troubleshooting steps:');
        console.error('   1. Check your internet connection');
        console.error('   2. Verify Supabase credentials in .env file');
        console.error('   3. Ensure Supabase project is active');
        console.error('   4. Check if firewall is blocking the connection');
        process.exit(1);
    }
}

testConnection();
