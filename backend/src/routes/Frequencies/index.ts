import { Router } from "express";
import { listFrequencies } from "src/controllers/frequencies/index.js";

const router = Router();

/**
 * @swagger
 * /frequencies:
 *   get:
 *     tags: [Frequencies]
 *     summary: Listar frequências
 *     description: Retorna todas as frequências disponíveis (Diária, Semanal, Mensal, Anual, etc.) para popular selects no front-end
 *     responses:
 *       200:
 *         description: Lista de frequências
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Frequency'
 *             examples:
 *               frequencies:
 *                 summary: Exemplo de frequências
 *                 value:
 *                   - id: 1
 *                     title: Mensal
 *                     intervalValue: 1
 *                     intervalUnit: meses
 *                   - id: 2
 *                     title: Semanal
 *                     intervalValue: 1
 *                     intervalUnit: semanas
 *                   - id: 3
 *                     title: Anual
 *                     intervalValue: 1
 *                     intervalUnit: anos
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", listFrequencies);

export default router;
