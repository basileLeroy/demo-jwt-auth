import pool from "../connect.mjs";
import bcrypt from "bcrypt";

const User = {
    all: async () => {
        let conn;
        let result;
        try {
            conn = await pool.getConnection()
            result = await conn.query(`SELECT * FROM users`);

        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
            return result
        }
    },
    create: async ({name, email, password, is_admin}) => {
        let conn;

        const hashSalt = 13
        const hashedPassword = await bcrypt.hash(password, hashSalt);

        try {
            conn = await pool.getConnection()
            const rows = await conn.prepare(`INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?);`);
            await rows.execute([name, email, hashedPassword, is_admin])
            
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
    },
    find: async (email) => {
        let conn;
        let result;
        try {
            conn = await pool.getConnection()
            const rows = await conn.prepare(`SELECT * FROM users WHERE email = ?`);
            result = await rows.execute([email]);

        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
            return result[0];
        }
    }
}

export default User;