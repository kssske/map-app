const Post = require("../models/postsModel");

exports.create = async (req, res) => {
    try {
        const { title, description, price, lat, lng } = req.body;

        const post = await Post.createPost(
            req.user.id,
            title,
            description,
            price,
            lat,
            lng
        );

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "サーバーエラー" });
    }
};

exports.getAll = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "サーバーエラー" });
    }
};