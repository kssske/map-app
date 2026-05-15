const User = require("../models/authModel");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if its already registered.
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "既に登録されているメールアドレスです" });

        const newUser = await User.createUser(email, password);

        // creat a token to log the user in
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: newUser });
    } catch (err) {
        res.status(500).json({ error: "サインアップに失敗しました" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findUserByEmail(email);

        if (!user) return res.status(401).json({ error: "ユーザーが見つかりません" });



        // 通行証（トークン）の発行
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "ログインに失敗しました" });
    }
};