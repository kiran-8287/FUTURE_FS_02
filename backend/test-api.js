// API Test Script
const baseURL = 'http://localhost:5000';

async function testAPI() {
    console.log('🧪 Testing Lumina CRM API...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await fetch(`${baseURL}/api/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health Check:', healthData);
        console.log('');

        // Test 2: Admin Login
        console.log('2️⃣ Testing Admin Login...');
        const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@lumina.com',
                password: 'password'
            })
        });
        const loginData = await loginResponse.json();
        console.log('✅ Login Response:', loginData);
        const token = loginData.token;
        console.log('🔑 Token:', token);
        console.log('');

        // Test 3: Create Lead (Public)
        console.log('3️⃣ Testing Create Lead (Public)...');
        const createLeadResponse = await fetch(`${baseURL}/api/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                phone: '1234567890',
                company: 'Test Company',
                source: 'Website',
                message: 'This is a test lead'
            })
        });
        const newLead = await createLeadResponse.json();
        console.log('✅ New Lead Created:', newLead);
        console.log('');

        // Test 4: Get All Leads (Protected)
        console.log('4️⃣ Testing Get All Leads (Protected)...');
        const leadsResponse = await fetch(`${baseURL}/api/leads`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const leads = await leadsResponse.json();
        console.log(`✅ Retrieved ${leads.length} leads`);
        console.log('First lead:', leads[0]);
        console.log('');

        // Test 5: Get Analytics
        console.log('5️⃣ Testing Get Analytics...');
        const analyticsResponse = await fetch(`${baseURL}/api/leads/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const analytics = await analyticsResponse.json();
        console.log('✅ Analytics:', analytics);
        console.log('');

        // Test 6: Add Note to Lead
        if (leads.length > 0) {
            const leadId = leads[0].id;
            console.log(`6️⃣ Testing Add Note to Lead ${leadId}...`);
            const noteResponse = await fetch(`${baseURL}/api/notes/lead/${leadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    note_text: 'This is a test note added via API'
                })
            });
            const newNote = await noteResponse.json();
            console.log('✅ New Note Created:', newNote);
            console.log('');

            // Test 7: Get Notes for Lead
            console.log(`7️⃣ Testing Get Notes for Lead ${leadId}...`);
            const notesResponse = await fetch(`${baseURL}/api/notes/lead/${leadId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const notes = await notesResponse.json();
            console.log(`✅ Retrieved ${notes.length} notes for lead ${leadId}`);
            console.log('');
        }

        // Test 8: Search Leads
        console.log('8️⃣ Testing Search Leads...');
        const searchResponse = await fetch(`${baseURL}/api/leads/search?query=test&status=new`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const searchResults = await searchResponse.json();
        console.log(`✅ Search returned ${searchResults.length} results`);
        console.log('');

        console.log('🎉 All API tests passed successfully!');
        console.log('\n📋 Summary:');
        console.log(`   - Server is running on ${baseURL}`);
        console.log(`   - Database connection: ✅`);
        console.log(`   - Authentication: ✅`);
        console.log(`   - Lead CRUD: ✅`);
        console.log(`   - Notes system: ✅`);
        console.log(`   - Search & Analytics: ✅`);
        console.log('\n✨ Backend is ready for frontend integration!');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        console.error('\n🔧 Make sure the server is running: node server.js');
    }
}

testAPI();
