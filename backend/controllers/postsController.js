const Post = require("../models/postsModel");

exports.create = async (req, res) => {
    try {
        const { userId, title, description, price, lat, lng } = req.body;

        const post = await Post.createPost(
            userId,
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
exports.getPost = async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    console.log(req.params);
    if (!post) {
        return res.status(404).json({
            error: "投稿が見つかりません"
        });
    }

    res.json(post);
};
exports.getAll = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "サーバーエラー" });
    }
};