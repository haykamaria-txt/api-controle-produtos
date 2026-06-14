const express = require("express");
const cors = require("cors");

const { swaggerServe, swaggerSetup, swaggerSpec } = require("./docs/swagger");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const healthRoutes = require("./routes/health.routes");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/api-docs.json", (_request, response) => response.json(swaggerSpec));
app.use("/api-docs", swaggerServe, swaggerSetup);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use(healthRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
