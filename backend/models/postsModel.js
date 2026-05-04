const { getDB } = require("../db");

exports.createPost = async (userId, title, description, price, lat, lng) => {
    const db = getDB();

    const result = await db.query(
        `INSERT INTO posts (user_id, title, description, price, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,   //return the data that just saved so i can use it right away
        [userId, title, description, price, lat, lng]
    );

    return result.rows[0];
};

exports.getAllPosts = async () => {
    const db = getDB();

    const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");

    return result.rows;
};