// Verify imported leads
const pool = require('./config/database');

async function verifyLeads() {
    try {
        // Get total count
        const countResult = await pool.query('SELECT COUNT(*) FROM leads');
        console.log(`\n📊 Total leads in database: ${countResult.rows[0].count}\n`);

        // Get latest 10 leads
        const leadsResult = await pool.query(
            'SELECT id, name, email, status, created_at FROM leads ORDER BY created_at DESC LIMIT 10'
        );

        console.log('📋 Latest 10 Leads:\n');
        leadsResult.rows.forEach((lead, index) => {
            console.log(`${index + 1}. ${lead.name} (${lead.email})`);
            console.log(`   Status: ${lead.status} | ID: ${lead.id}`);
            console.log('');
        });

        // Get count by status
        const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM leads 
      GROUP BY status 
      ORDER BY count DESC
    `);

        console.log('📈 Leads by Status:\n');
        statusResult.rows.forEach(row => {
            console.log(`   ${row.status}: ${row.count} leads`);
        });

        pool.end();
    } catch (error) {
        console.error('Error:', error);
        pool.end();
    }
}

verifyLeads();
