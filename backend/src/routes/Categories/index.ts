import { Router } from "express";
import {
  listCategories,
  createCategory,
} from "src/controllers/categories/index.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Criar uma categoria
 *     description: Cria uma nova categoria com nome e ícone opcional
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da categoria
 *                 example: Restaurantes
 *               webDeviceIcon:
 *                 type: string
 *                 description: Nome do ícone do Lucide Icons
 *                 example: Coffee
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", authMiddleware, createCategory);

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
