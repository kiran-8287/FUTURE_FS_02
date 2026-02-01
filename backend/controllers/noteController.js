// Notes management controller
const pool = require('../config/database');

/**
 * Get all notes for a specific lead
 * Returns notes ordered by creation date (newest first)
 */
const getNotesByLeadId = async (req, res) => {
    try {
        const { leadId } = req.params;

        const result = await pool.query(
            'SELECT * FROM notes WHERE lead_id = $1 ORDER BY created_at DESC',
            [leadId]
        );

        res.status(200).json(result.rows);
        console.log(`✅ Retrieved ${result.rows.length} notes for lead ${leadId}`);

    } catch (error) {
        console.error('❌ Error fetching notes:', error);
        res.status(500).json({
            error: 'Failed to fetch notes.'
        });
    }
};

/**
 * Create a new note for a lead
 */
const createNote = async (req, res) => {
    try {
        const { leadId } = req.params;
        const { note_text } = req.body;

        // Validate note text
        if (!note_text || note_text.trim() === '') {
            return res.status(400).json({
                error: 'Note text is required.'
            });
        }

        // Check if lead exists before creating note
        const leadCheck = await pool.query(
            'SELECT id FROM leads WHERE id = $1',
            [leadId]
        );

        if (leadCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'Lead not found.'
            });
        }

        // Insert new note
        const result = await pool.query(
            `INSERT INTO notes (lead_id, note_text, created_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
            [leadId, note_text]
        );

        res.status(201).json(result.rows[0]);
        console.log(`✅ New note created for lead ${leadId}`);

    } catch (error) {
        console.error('❌ Error creating note:', error);
        res.status(500).json({
            error: 'Failed to create note.'
        });
    }
};

/**
 * Delete a note by ID
 */
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM notes WHERE id = $1 RETURNING *',
            [id]
        );

        // Check if note exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Note not found.'
            });
        }

        res.status(200).json({
            message: 'Note deleted successfully.',
            deletedNote: result.rows[0]
        });
        console.log(`✅ Deleted note with ID: ${id}`);

    } catch (error) {
        console.error('❌ Error deleting note:', error);
        res.status(500).json({
            error: 'Failed to delete note.'
        });
    }
};

module.exports = {
    getNotesByLeadId,
    createNote,
    deleteNote
};
