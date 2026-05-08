const router = require("express").Router();
const controller = require("../controllers/postsController");
const auth = require("../middleware/auth");

router.post("/", controller.create);
router.get("/", controller.getAll);

module.exports = router;