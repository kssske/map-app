const router = require("express").Router();
const controller = require("../controllers/authController");
const { rateLimit } = require("express-rate-limit");
const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 1時間
    max: 5,
    message: { error: "ログイン試行回数が上限を超えました" },
    standardHeaders: true,   // so i can see detail 
    legacyHeaders: false,
});
router.post("/signup", controller.validateMark, controller.signup);
router.post("/login", loginLimiter, controller.validateMark, controller.login);
module.exports = router;


