const { Router } = require("express");

const categoryController = require("../controllers/category.controller");
const { admin } = require("../middlewares/admin.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", categoryController.index);
router.get("/:id", categoryController.show);
router.post("/", authenticate, admin, categoryController.store);
router.put("/:id", authenticate, admin, categoryController.update);
router.delete("/:id", authenticate, admin, categoryController.destroy);

module.exports = router;
