const router = require("express").Router();
const controller = require("../controllers/postsController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getPost);

module.exports = router;