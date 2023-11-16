const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
    user: "postgres",
    password: process.env.DB_PASSWORD,
    host: "localhost",
    port: 5433,
    database: "jobtracker"
});

module.exports = pool;