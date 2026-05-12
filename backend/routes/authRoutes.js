const router = require("express").Router();
const controller = require("../controllers/authController");

router.post("/signup", controller.signup);
router.post("/login", controller.login);

module.exports = router;


app.use("/api/posts", require("./routes/postsRoutes"));
app.use("/api", require("./routes/authRoutes")); 