const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
  },
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to the database.");
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err);
    throw err;
  }
}

module.exports = connectToDatabase;
