const pool = require('../config/database');

/**
 * Create an audit log entry
 * @param {string} userEmail - Email of the user performing the action
 * @param {string} actionType - Type of action (LEAD_CREATED, LEAD_UPDATED, etc.)
 * @param {string} entityType - Type of entity (lead, user, etc.)
 * @param {string} entityId - ID of the entity
 * @param {object} details - Additional details about the action
 */
const createAuditLog = async (userEmail, actionType, entityType, entityId, details = {}) => {
    try {
        await pool.query(
            `INSERT INTO audit_logs (user_email, action_type, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
            [userEmail, actionType, entityType, entityId, JSON.stringify(details)]
        );
        console.log(`📝 Audit log created: ${actionType} for ${entityType} ${entityId}`);
    } catch (error) {
        console.error('❌ Error creating audit log:', error);
        // Don't throw - audit logging should not break the main operation
    }
};

/**
 * Get audit logs with optional filtering and pagination
 */
const getAuditLogs = async (req, res) => {
    try {
        const { limit = 50, offset = 0, entity_type, action_type } = req.query;

        let query = 'SELECT * FROM audit_logs WHERE 1=1';
        const params = [];
        let paramCount = 1;

        // Filter by entity type
        if (entity_type) {
            query += ` AND entity_type = $${paramCount}`;
            params.push(entity_type);
            paramCount++;
        }

        // Filter by action type
        if (action_type) {
            query += ` AND action_type = $${paramCount}`;
            params.push(action_type);
            paramCount++;
        }

        // Order by most recent first
        query += ` ORDER BY created_at DESC`;

        // Add pagination
        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) FROM audit_logs WHERE 1=1';
        const countParams = [];
        let countParamCount = 1;

        if (entity_type) {
            countQuery += ` AND entity_type = $${countParamCount}`;
            countParams.push(entity_type);
            countParamCount++;
        }

        if (action_type) {
            countQuery += ` AND action_type = $${countParamCount}`;
            countParams.push(action_type);
        }

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            logs: result.rows.map(log => ({
                ...log,
                details: log.details ? JSON.parse(log.details) : {}
            })),
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: parseInt(offset) + result.rows.length < total
            }
        });

        console.log(`✅ Retrieved ${result.rows.length} audit logs`);

    } catch (error) {
        console.error('❌ Error fetching audit logs:', error);
        res.status(500).json({
            error: 'Failed to fetch audit logs.'
        });
    }
};

module.exports = {
    createAuditLog,
    getAuditLogs
};
