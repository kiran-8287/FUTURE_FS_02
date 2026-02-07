const pool = require('../config/database');

const MOCK_LEADS = [
    {
        id: "1",
        name: 'Aarav Patel',
        email: 'aarav.p@techflow.in',
        phone: '+91 98765 43210',
        company: 'TechFlow Solutions',
        source: 'Website',
        status: 'new',
        message: 'Interested in your enterprise security protocols.',
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        name: 'Vihaan Kumar',
        email: 'vihaan.k@innovate.co.in',
        phone: '+91 98989 89898',
        company: 'Innovate Corp',
        source: 'Referral',
        status: 'contacted',
        message: 'Looking for a comprehensive CRM solution.',
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        name: 'Ananya Sharma',
        email: 'ananya@solarsystems.com',
        phone: '+91 99887 76655',
        company: 'Solar Systems Ltd',
        source: 'LinkedIn',
        status: 'converted',
        message: 'Urgent consultation needed regarding workflow automation.',
        created_at: new Date().toISOString()
    },
    {
        id: "4",
        name: 'Rohan Gupta',
        email: 'rohan@futuretech.com',
        phone: '+91 91234 56789',
        company: 'Future Tech',
        source: 'Social Media',
        status: 'new',
        message: 'I want to upgrade my existing ERP integration.',
        created_at: new Date().toISOString()
    }
];

/**
 * Get all leads from the database
 * Returns leads ordered by creation date (newest first)
 */
const getAllLeads = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM leads ORDER BY created_at DESC'
        );

        // If no leads found and mock login is allowed, return mock leads
        if (result.rows.length === 0 && process.env.ALLOW_MOCK_LOGIN === 'true') {
            console.log('⚠️ No leads in DB, returning MOCK LEADS');
            return res.status(200).json(MOCK_LEADS);
        }

        res.status(200).json(result.rows);
        console.log(`✅ Retrieved ${result.rows.length} leads`);

    } catch (error) {
        console.error('❌ Error fetching leads:', error);

        // If query fails (connection error) and mock login is allowed, return mock leads
        if (process.env.ALLOW_MOCK_LOGIN === 'true') {
            console.log('⚠️ Database connection failed, returning MOCK LEADS');
            return res.status(200).json(MOCK_LEADS);
        }

        res.status(500).json({
            error: 'Failed to fetch leads.'
        });
    }
};

/**
 * Get a single lead by ID
 */
const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM leads WHERE id = $1',
            [id]
        );

        // Check if lead exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Lead not found.'
            });
        }

        res.status(200).json(result.rows[0]);
        console.log(`✅ Retrieved lead with ID: ${id}`);

    } catch (error) {
        console.error('❌ Error fetching lead:', error);
        res.status(500).json({
            error: 'Failed to fetch lead.'
        });
    }
};

/**
 * Create a new lead
 * Used by public contact form - no authentication required
 */
const createLead = async (req, res) => {
    try {
        const { name, email, phone, company, source, message } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required.'
            });
        }

        // Insert new lead into database
        const result = await pool.query(
            `INSERT INTO leads (name, email, phone, company, source, message, status, value, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'new', $7, NOW())
       RETURNING *`,
            [name, email, phone || null, company || null, source || 'Website', message || null, req.body.value || 0]
        );

        const newLead = result.rows[0];

        res.status(201).json(newLead);
        console.log(`✅ New lead created: ${name} (${email})`);

    } catch (error) {
        console.error('❌ Error creating lead:', error);
        res.status(500).json({
            error: 'Failed to create lead.'
        });
    }
};

/**
 * Update lead status
 * Valid statuses: new, contacted, converted
 */
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Normalize status to lowercase
        const normalizedStatus = status ? status.toLowerCase() : null;

        // Validate status value
        const validStatuses = ['new', 'contacted', 'converted', 'lost'];
        if (!normalizedStatus || !validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                error: 'Invalid status. Must be one of: new, contacted, converted, lost.'
            });
        }

        // Update lead status
        const result = await pool.query(
            'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
            [normalizedStatus, id]
        );

        res.status(200).json(result.rows[0]);
        console.log(`✅ Updated lead ${id} status to: ${status}`);

    } catch (error) {
        console.error('❌ Error updating lead status:', error);
        res.status(500).json({
            error: 'Failed to update lead status.'
        });
    }
};

/**
 * Update lead details
 * Updates any provided fields while keeping others unchanged
 */
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, company, source, message } = req.body;

        // Update lead with COALESCE to keep existing values if new ones not provided
        const result = await pool.query(
            `UPDATE leads 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           company = COALESCE($4, company),
           source = COALESCE($5, source),
           message = COALESCE($6, message)
       WHERE id = $7
       RETURNING *`,
            [name, email, phone, company, source, message, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Lead not found.'
            });
        }

        const updatedLead = result.rows[0];

        res.status(200).json(updatedLead);
        console.log(`✅ Updated lead with ID: ${id}`);

    } catch (error) {
        console.error('❌ Error updating lead:', error);
        res.status(500).json({
            error: 'Failed to update lead.'
        });
    }
};

/**
 * Delete a lead
 */
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM leads WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Lead not found.'
            });
        }

        const deletedLead = result.rows[0];

        res.status(200).json({
            message: 'Lead deleted successfully.',
            deletedLead
        });
        console.log(`✅ Deleted lead with ID: ${id}`);

    } catch (error) {
        console.error('❌ Error deleting lead:', error);
        res.status(500).json({
            error: 'Failed to delete lead.'
        });
    }
};

/**
 * Search and filter leads
 * Supports filtering by query (name/email), status, and source
 */
const searchLeads = async (req, res) => {
    try {
        const { query, status, source } = req.query;

        // Build dynamic SQL query with filters
        let sqlQuery = 'SELECT * FROM leads WHERE 1=1';
        const params = [];
        let paramCount = 1;

        // Filter by name or email (case-insensitive)
        if (query) {
            sqlQuery += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
            params.push(`%${query}%`);
            paramCount++;
        }

        // Filter by status
        if (status) {
            sqlQuery += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        // Filter by source
        if (source) {
            sqlQuery += ` AND source = $${paramCount}`;
            params.push(source);
            paramCount++;
        }

        // Order by creation date (newest first)
        sqlQuery += ' ORDER BY created_at DESC';

        const result = await pool.query(sqlQuery, params);

        res.status(200).json(result.rows);
        console.log(`✅ Search returned ${result.rows.length} leads`);

    } catch (error) {
        console.error('❌ Error searching leads:', error);
        res.status(500).json({
            error: 'Failed to search leads.'
        });
    }
};

/**
 * Get analytics data
 * Returns total leads, counts by status, and conversion rate
 */
const getAnalytics = async (req, res) => {
    try {
        // Get total lead count
        const totalResult = await pool.query('SELECT COUNT(*) FROM leads');
        const total = parseInt(totalResult.rows[0].count);

        if (total === 0 && process.env.ALLOW_MOCK_LOGIN === 'true') {
            console.log('⚠️ No leads in DB, returning MOCK ANALYTICS');
            return res.status(200).json({
                total: MOCK_LEADS.length,
                new: MOCK_LEADS.filter(l => l.status === 'new').length,
                contacted: MOCK_LEADS.filter(l => l.status === 'contacted').length,
                converted: MOCK_LEADS.filter(l => l.status === 'converted').length,
                conversionRate: ((MOCK_LEADS.filter(l => l.status === 'converted').length / MOCK_LEADS.length) * 100).toFixed(2)
            });
        }

        // Get counts by status
        const newResult = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'new'");
        const contactedResult = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'contacted'");
        const convertedResult = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'converted'");

        const newCount = parseInt(newResult.rows[0].count);
        const contactedCount = parseInt(contactedResult.rows[0].count);
        const convertedCount = parseInt(convertedResult.rows[0].count);

        // Calculate conversion rate
        const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(2) : 0;

        const analytics = {
            total,
            new: newCount,
            contacted: contactedCount,
            converted: convertedCount,
            conversionRate: parseFloat(conversionRate)
        };

        res.status(200).json(analytics);
        console.log('✅ Analytics data retrieved');

    } catch (error) {
        console.error('❌ Error fetching analytics:', error);

        if (process.env.ALLOW_MOCK_LOGIN === 'true') {
            console.log('⚠️ Database connection failed, returning MOCK ANALYTICS');
            return res.status(200).json({
                total: MOCK_LEADS.length,
                new: MOCK_LEADS.filter(l => l.status === 'new').length,
                contacted: MOCK_LEADS.filter(l => l.status === 'contacted').length,
                converted: MOCK_LEADS.filter(l => l.status === 'converted').length,
                conversionRate: ((MOCK_LEADS.filter(l => l.status === 'converted').length / MOCK_LEADS.length) * 100).toFixed(2)
            });
        }

        res.status(500).json({
            error: 'Failed to fetch analytics.'
        });
    }
};

module.exports = {
    getAllLeads,
    getLeadById,
    createLead,
    updateLeadStatus,
    updateLead,
    deleteLead,
    searchLeads,
    getAnalytics
};
