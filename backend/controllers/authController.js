const User = require("../models/authModel");



exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // すでに登録されていないかチェック（任意で追加）
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "既に登録されているメールアドレスです" });

        const newUser = await User.createUser(email, password);

        // 登録後すぐにログイン状態にするためのトークン発行
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "1d" });

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

        // パスワードの照合（入力されたもの vs DBにあるハッシュ化されたもの）
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "パスワードが正しくありません" });

        // 通行証（トークン）の発行
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "ログインに失敗しました" });
    }
};