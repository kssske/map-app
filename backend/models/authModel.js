const { getDB } = require("../db");


exports.createUser = async (email, password) => {
    const db = getDB();


    const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
        [email, password]
    );
    return result.rows[0];
};


exports.findUserByEmail = async (email) => {
    const db = getDB();
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
};