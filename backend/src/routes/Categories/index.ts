import { Router } from "express";
import { listCategories } from "src/controllers/categories/index.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar categorias
 *     description: Retorna todas as categorias disponíveis para popular selects no front-end
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", listCategories);

export default router;
