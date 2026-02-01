// Notes management routes
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
    getNotesByLeadId,
    createNote,
    deleteNote
} = require('../controllers/noteController');

/**
 * GET /api/notes/lead/:leadId
 * Get all notes for a specific lead
 * Requires authentication
 */
router.get('/lead/:leadId', authenticateToken, getNotesByLeadId);

/**
 * POST /api/notes/lead/:leadId
 * Create a new note for a lead
 * Requires authentication
 */
router.post('/lead/:leadId', authenticateToken, createNote);

/**
 * DELETE /api/notes/:id
 * Delete a note by ID
 * Requires authentication
 */
router.delete('/:id', authenticateToken, deleteNote);

module.exports = router;
