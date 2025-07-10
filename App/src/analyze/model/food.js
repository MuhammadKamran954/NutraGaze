
const baseEntitySQL = require('../../../../common/base_entity');
const db = require('./../../../../config/db');

const FoodPhoto = async () => {
    await db.query(`CREATE TABLE IF NOT EXISTS food_photo(
        ${baseEntitySQL},
        user_id INTEGER NOT NULL,
        image VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`
    );
}

module.exports = FoodPhoto;