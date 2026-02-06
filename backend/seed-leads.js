const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' }); // Adjust path if needed

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // ssl: false // Explicitly disable SSL for this script if local
});

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const companies = ['Tech Flow', 'Innovate Corp', 'Solar Systems', 'Future Tech', 'Global Solutions', 'Alpha Dynamic', 'Omega Systems', 'Pinnacle Group', 'Vertex Inc', 'Apex Digital'];
const sources = ['Website', 'LinkedIn', 'Referral', 'Social Media', 'Cold Call'];
const statuses = ['new', 'contacted', 'converted'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const seedLeads = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        const leads = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 15); // Last 15 days

        for (let i = 0; i < 50; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const company = getRandomElement(companies);

            const lead = {
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.replace(/\s/g, '').toLowerCase()}.com`,
                phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                company: company,
                source: getRandomElement(sources),
                status: getRandomElement(statuses),
                message: `Interested in ${company} services.`,
                value: Math.floor(Math.random() * 500000) + 10000, // Random value between 10k and 500k
                created_at: generateRandomDate(startDate, endDate)
            };
            leads.push(lead);
        }

        console.log(`Generated ${leads.length} leads. Inserting into database...`);

        for (const lead of leads) {
            await pool.query(
                `INSERT INTO leads (name, email, phone, company, source, status, message, value, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [lead.name, lead.email, lead.phone, lead.company, lead.source, lead.status, lead.message, lead.value, lead.created_at]
            );
        }

        console.log('✅ Seeding complete! 50 leads added.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedLeads();
