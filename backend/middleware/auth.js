// JWT authentication middleware
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token from Authorization header and attaches user info to request
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get the authorization header
        const authHeader = req.headers['authorization'];

        // Extract token from "Bearer TOKEN" format
        const token = authHeader && authHeader.split(' ')[1];

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                error: 'Access denied. No token provided.'
            });
        }

        // Verify the token using JWT_SECRET from environment variables
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                // Token is invalid or expired
                return res.status(403).json({
                    error: 'Invalid or expired token.'
                });
            }

            // Attach user information to request object
            req.user = user;

            // Continue to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.error('❌ Authentication error:', error);
        return res.status(500).json({
            error: 'Internal server error during authentication.'
        });
    }
};

module.exports = authenticateToken;
