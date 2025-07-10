const db = require('./../../../../config/db');
const baseEntitySQL = require('./../../../../common/base_entity');
const Users = async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS users(
        ${baseEntitySQL},
        country_code VARCHAR(255),
        phone VARCHAR(255),
        name VARCHAR(255),
        profile_photo VARCHAR(255),
        password VARCHAR(255),
        is_profile_completed BOOLEAN DEFAULT FALSE 
        )`);
}

module.exports = Users;