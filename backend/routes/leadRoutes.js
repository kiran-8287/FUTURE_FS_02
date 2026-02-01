// Lead management routes
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    getAllLeads,
    getLeadById,
    createLead,
    updateLeadStatus,
    updateLead,
    deleteLead,
    searchLeads,
    getAnalytics
} = require('../controllers/leadController');

/**
 * POST /api/leads
 * Create a new lead (public contact form)
 * No authentication required
 */
router.post('/', createLead);

/**
 * GET /api/leads
 * Get all leads
 * Requires authentication
 */
router.get('/', authenticateToken, getAllLeads);

/**
 * GET /api/leads/search
 * Search and filter leads
 * Requires authentication
 * Query params: query, status, source
 */
router.get('/search', authenticateToken, searchLeads);

/**
 * GET /api/leads/analytics
 * Get analytics data
 * Requires authentication
 */
router.get('/analytics', authenticateToken, getAnalytics);

/**
 * GET /api/leads/:id
 * Get a single lead by ID
 * Requires authentication
 */
router.get('/:id', authenticateToken, getLeadById);

/**
 * PUT /api/leads/:id
 * Update lead details
 * Requires authentication
 */
router.put('/:id', authenticateToken, updateLead);

/**
 * PUT /api/leads/:id/status
 * Update lead status
 * Requires authentication
 */
router.put('/:id/status', authenticateToken, updateLeadStatus);

/**
 * DELETE /api/leads/:id
 * Delete a lead
 * Requires authentication
 */
router.delete('/:id', authenticateToken, deleteLead);

module.exports = router;
