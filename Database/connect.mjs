import mariadb from "mariadb"
import dotenv from "dotenv"

dotenv.config()

const pool = mariadb.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOSTNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

export default pool;