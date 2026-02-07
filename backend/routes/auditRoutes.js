const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');

/**
 * @route   GET /api/audit-logs
 * @desc    Get audit logs with optional filtering
 * @access  Private (in production, add authentication middleware)
 * @query   limit - Number of logs to return (default: 50)
 * @query   offset - Offset for pagination (default: 0)
 * @query   entity_type - Filter by entity type (e.g., 'lead')
 * @query   action_type - Filter by action type (e.g., 'LEAD_CREATED')
 */
router.get('/', getAuditLogs);

module.exports = router;
