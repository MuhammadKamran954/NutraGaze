const { Client } = require('pg');
require('dotenv').config();
const db = new Client({
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    user: process.env.USER,
    host: process.env.HOST
});

module.exports = db;