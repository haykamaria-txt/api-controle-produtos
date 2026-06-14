const { Router } = require("express");

const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const healthRoutes = require("./health.routes");
const productRoutes = require("./product.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use(healthRoutes);
router.use("/products", productRoutes);

module.exports = router;
