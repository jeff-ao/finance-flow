import { Router } from "express";
import {
  createTransaction,
  listTransactions,
  updateTransaction,
} from "src/controllers/transactions/index.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";

const router = Router();

// Todas as rotas de transações requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Criar uma nova transação
 *     description: Cria uma transação financeira (entrada ou saída)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - amount
 *               - date
 *               - type
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da transação
 *                 example: Compra no supermercado
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Valor da transação
 *                 example: 150.50
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data da transação
 *                 example: 2025-12-04T10:00:00Z
 *               type:
 *                 type: string
 *                 enum: [INPUT, OUTPUT]
 *                 description: Tipo da transação
 *                 example: OUTPUT
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID]
 *                 description: Status da transação
 *                 example: PAID
 *               category_id:
 *                 type: integer
 *                 description: ID da categoria (opcional)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Transação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", createTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Listar transações
 *     description: Lista transações com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Mês para filtrar (1-12)
 *         example: 12
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Ano para filtrar
 *         example: 2025
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID]
 *         description: Filtrar por status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Buscar no título (case-insensitive)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da categoria
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INPUT, OUTPUT]
 *         description: Filtrar por tipo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Quantidade de itens por página
 *         example: 50
 *     responses:
 *       200:
 *         description: Lista paginada de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Página atual
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       description: Itens por página
 *                       example: 50
 *                     total:
 *                       type: integer
 *                       description: Total de itens
 *                       example: 150
 *                     totalPages:
 *                       type: integer
 *                       description: Total de páginas
 *                       example: 3
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", listTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     tags: [Transactions]
 *     summary: Atualizar uma transação
 *     description: Atualiza uma transação com diferentes escopos (SINGLE, FUTURE, ALL)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [SINGLE, FUTURE, ALL]
 *           default: SINGLE
 *         description: |
 *           Escopo da atualização:
 *           - SINGLE: Atualiza apenas esta transação
 *           - FUTURE: Atualiza esta e as futuras (se for parcela)
 *           - ALL: Atualiza todas as transações da recorrência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Novo valor
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID]
 *                 description: Novo status
 *               category_id:
 *                 type: integer
 *                 nullable: true
 *                 description: Nova categoria
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch("/:id", updateTransaction);

export default router;
