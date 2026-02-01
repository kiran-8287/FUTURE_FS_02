// Script to import mock leads data into the database
const pool = require('./config/database');
require('dotenv').config();

// Mock leads data from constants.ts
const MOCK_LEADS = [
    {
        name: 'Aarav Patel',
        email: 'aarav.p@techflow.in',
        phone: '+91 98765 43210',
        company: 'TechFlow Solutions',
        source: 'Website',
        status: 'new',
        message: 'Interested in your enterprise security protocols.',
    },
    {
        name: 'Vihaan Kumar',
        email: 'vihaan.k@innovate.co.in',
        phone: '+91 98989 89898',
        company: 'Innovate Corp',
        source: 'Referral',
        status: 'contacted',
        message: 'Looking for a comprehensive CRM solution.',
    },
    {
        name: 'Ananya Sharma',
        email: 'ananya@solarsystems.com',
        phone: '+91 99887 76655',
        company: 'Solar Systems Ltd',
        source: 'LinkedIn',
        status: 'converted',
        message: 'Urgent consultation needed regarding workflow automation.',
    },
    {
        name: 'Rohan Gupta',
        email: 'rohan@futuretech.com',
        phone: '+91 91234 56789',
        company: 'Future Tech',
        source: 'Social Media',
        status: 'new',
        message: 'I want to upgrade my existing ERP integration.',
    },
    {
        name: 'Arjun Reddy',
        email: 'arjun@securecorp.in',
        phone: '+91 95555 44444',
        company: 'Secure Corp',
        source: 'Other',
        status: 'contacted',
        message: 'Need better encryption for our data centers.',
    },
    {
        name: 'Diya Malhotra',
        email: 'diya@creativearts.com',
        phone: '+91 94444 11111',
        company: 'Creative Arts Studio',
        source: 'Referral',
        status: 'converted',
        message: '',
    },
    {
        name: 'Vikram Singh',
        email: 'vikram@chemworks.com',
        phone: '+91 93333 22222',
        company: 'ChemWorks',
        source: 'Website',
        status: 'new',
        message: 'Need distribution logistics software.',
    },
    {
        name: 'Rahul Verma',
        email: 'rahul@globallogistics.com',
        phone: '+91 92121 21212',
        company: 'Global Logistics',
        source: 'Other',
        status: 'new',
        message: 'Tracking shipment efficiency.',
    },
    {
        name: 'Ishaan Joshi',
        email: 'ishaan@alliance.org',
        phone: '+91 97777 11111',
        company: 'Alliance Group',
        source: 'Referral',
        status: 'contacted',
        message: '',
    },
    {
        name: 'Aditya Mishra',
        email: 'aditya@quantum.io',
        phone: '+91 99999 88888',
        company: 'Quantum Labs',
        source: 'Website',
        status: 'new',
        message: 'Looking for data processing capabilities.',
    },
    {
        name: 'Kavita Iyer',
        email: 'kavita@securenet.io',
        phone: '+91 90222 01999',
        company: 'SecureNet',
        source: 'LinkedIn',
        status: 'converted',
        message: '',
    },
    {
        name: 'Aryan Nair',
        email: 'aryan@insight.com',
        phone: '+91 90222 01988',
        company: 'Insight Analytics',
        source: 'Website',
        status: 'contacted',
        message: 'I want to verify your software accuracy.',
    },
    {
        name: 'Karthik Gowda',
        email: 'karthik@bridges.in',
        phone: '+91 95550 00000',
        company: 'Bridges Logistics',
        source: 'Other',
        status: 'new',
        message: 'Need logistics optimization.',
    },
    {
        name: 'Riya Chatterjee',
        email: 'riya@wolfconsulting.com',
        phone: '+91 95556 66777',
        company: 'Wolf Consulting',
        source: 'Referral',
        status: 'new',
        message: 'Budget constraints.',
    },
    {
        name: 'Sanjay Mehra',
        email: 'sanjay@starenterprise.com',
        phone: '+91 95551 70170',
        company: 'Star Enterprise',
        source: 'Social Media',
        status: 'contacted',
        message: '',
    }
];

async function importLeads() {
    console.log('🚀 Starting lead import...\n');

    try {
        let imported = 0;
        let skipped = 0;

        for (const lead of MOCK_LEADS) {
            try {
                // Check if lead already exists by email
                const existing = await pool.query(
                    'SELECT id FROM leads WHERE email = $1',
                    [lead.email]
                );

                if (existing.rows.length > 0) {
                    console.log(`⏭️  Skipped: ${lead.name} (${lead.email}) - already exists`);
                    skipped++;
                    continue;
                }

                // Insert lead
                const result = await pool.query(
                    `INSERT INTO leads (name, email, phone, company, source, message, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING id`,
                    [lead.name, lead.email, lead.phone, lead.company, lead.source, lead.message || null, lead.status]
                );

                console.log(`✅ Imported: ${lead.name} (${lead.email}) - ID: ${result.rows[0].id}`);
                imported++;
            } catch (error) {
                console.error(`❌ Error importing ${lead.name}:`, error.message);
            }
        }

        console.log('\n📊 Import Summary:');
        console.log(`   ✅ Successfully imported: ${imported} leads`);
        console.log(`   ⏭️  Skipped (already exist): ${skipped} leads`);
        console.log(`   📝 Total processed: ${MOCK_LEADS.length} leads`);

        // Show current lead count
        const countResult = await pool.query('SELECT COUNT(*) FROM leads');
        console.log(`\n📈 Total leads in database: ${countResult.rows[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Import failed:', error);
        process.exit(1);
    }
}

importLeads();
