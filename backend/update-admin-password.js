const pool = require('./config/database');
const bcrypt = require('bcrypt');
require('dotenv').config();

const updatePassword = async () => {
    const newPassword = 'LuminaCrm@Admin2026!';
    const email = 'admin@lumina.com';

    try {
        console.log('🔄 Hashing new password...');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        console.log(`🔄 Updating password for ${email} in database...`);
        const result = await pool.query(
            'UPDATE admin_users SET password = $1 WHERE email = $2 RETURNING email',
            [hashedPassword, email]
        );

        if (result.rows.length > 0) {
            console.log(`✅ Successfully updated password for: ${result.rows[0].email}`);
        } else {
            console.log(`⚠️  User ${email} not found in admin_users table.`);

            // Optional: If no admin user exists, we might want to create one
            // const insertResult = await pool.query(
            //     'INSERT INTO admin_users (email, password) VALUES ($1, $2) RETURNING email',
            //     [email, hashedPassword]
            // );
            // console.log(`✅ Created new admin user: ${insertResult.rows[0].email}`);
        }

    } catch (error) {
        console.error('❌ Error updating password:', error);
    } finally {
        await pool.end();
        process.exit();
    }
};

updatePassword();
