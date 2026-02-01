// Authentication controller for admin login
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Admin login function
 * Authenticates admin user and returns JWT token
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required.'
            });
        }

        // Query database for admin user with matching email
        const result = await pool.query(
            'SELECT * FROM admin_users WHERE email = $1',
            [email]
        );

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password.'
            });
        }

        const user = result.rows[0];

        // Compare password - support both plain text and bcrypt hashed passwords
        let isPasswordValid = false;

        // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
        if (user.password.startsWith('$2')) {
            // Compare with bcrypt
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Compare plain text password
            isPasswordValid = (password === user.password);
        }

        // If password is invalid, return error
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password.'
            });
        }

        // Create JWT token with user information
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Token expires in 24 hours
        );

        // Return success response with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });

        console.log(`✅ Admin user logged in: ${user.email}`);

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            error: 'Internal server error during login.'
        });
    }
};

module.exports = { login };
