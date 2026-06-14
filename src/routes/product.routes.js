const { Router } = require("express");

const productController = require("../controllers/product.controller");
const { admin } = require("../middlewares/admin.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", productController.index);
router.get("/:id", productController.show);
router.post("/", authenticate, admin, productController.store);
router.put("/:id", authenticate, admin, productController.update);
router.delete("/:id", authenticate, admin, productController.destroy);

module.exports = router;
