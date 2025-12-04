import { Router } from "express";
import {
  createRecurrence,
  listRecurrences,
  getRecurrenceById,
  deleteRecurrence,
} from "src/controllers/recurrences/index.js";
import { authMiddleware } from "src/middlewares/auth.middleware.js";

const router = Router();

// Todas as rotas de recorrências requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /recurrences:
 *   post:
 *     tags: [Recurrences]
 *     summary: Criar uma recorrência
 *     description: Cria uma recorrência e gera automaticamente todas as transações filhas
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
 *               - start_date
 *               - type
 *               - frequency_id
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da recorrência
 *                 example: Compra iPhone
 *               amount:
 *                 type: number
 *                 format: decimal
 *                 description: Valor da parcela
 *                 example: 250.00
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Data de início
 *                 example: 2025-01-10T00:00:00Z
 *               type:
 *                 type: string
 *                 enum: [INPUT, OUTPUT]
 *                 description: Tipo da recorrência
 *                 example: OUTPUT
 *               category_id:
 *                 type: integer
 *                 description: ID da categoria (opcional)
 *                 example: 1
 *               total_installments:
 *                 type: integer
 *                 nullable: true
 *                 description: Total de parcelas (null = infinito, gera 12 meses)
 *                 example: 12
 *               frequency_id:
 *                 type: integer
 *                 description: ID da frequência
 *                 example: 1
 *     responses:
 *       201:
 *         description: Recorrência criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recurrence:
 *                   $ref: '#/components/schemas/Recurrence'
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", createRecurrence);

/**
 * @swagger
 * /recurrences:
 *   get:
 *     tags: [Recurrences]
 *     summary: Listar recorrências
 *     description: Lista todas as recorrências do usuário com filtros e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *         example: true
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
 *         description: Lista paginada de recorrências
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recurrence'
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
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       description: Total de páginas
 *                       example: 1
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", listRecurrences);

/**
 * @swagger
 * /recurrences/{id}:
 *   get:
 *     tags: [Recurrences]
 *     summary: Buscar recorrência por ID
 *     description: Retorna os detalhes de uma recorrência específica com todas as transações vinculadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da recorrência
 *     responses:
 *       200:
 *         description: Detalhes da recorrência
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recurrence'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:id", getRecurrenceById);

/**
 * @swagger
 * /recurrences/{id}:
 *   delete:
 *     tags: [Recurrences]
 *     summary: Deletar uma recorrência
 *     description: |
 *       Deleta uma recorrência e suas parcelas.
 *       - Se keep_history=true: mantém as parcelas PAID e marca a recorrência como inativa
 *       - Se keep_history=false ou omitido: deleta tudo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da recorrência
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keep_history:
 *                 type: boolean
 *                 description: Se true, mantém parcelas pagas e marca como inativa
 *                 example: true
 *     responses:
 *       200:
 *         description: Recorrência deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recorrência deletada com sucesso
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/:id", deleteRecurrence);

export default router;
