const { Router } = require("express");

const healthController = require("../controllers/health.controller");

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica se a API esta online.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API online.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get("/health", healthController.show);

module.exports = router;
