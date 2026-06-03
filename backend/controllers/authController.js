const User = require("../models/authModel");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
exports.validateMark = [
    body('email')
        .isLength({ min: 2 }).withMessage('パスワードは1文字以上で入力してください'),
    body('password')
        .isLength({ min: 1 }).withMessage('パスワードは1文字以上で入力してください'),

    // バリデーション結果を判定するミドルウェア関数
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if its already registered.
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "既に登録されているメールアドレスです" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(email, hashedPassword);



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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "パスワードが一致しません" });
        }


        // 通行証（トークン）の発行
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "ログインに失敗しました" });
    }
};