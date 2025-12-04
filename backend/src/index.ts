import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/Users/index.js";
import transactionRoutes from "./routes/Transactions/index.js";
import recurrenceRoutes from "./routes/Recurrences/index.js";
import categoryRoutes from "./routes/Categories/index.js";
import frequencyRoutes from "./routes/Frequencies/index.js";

const app = express();
const port = 3000;

app.use(express.json());

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Finance Flow API Documentation",
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Servidor Express está rodando com sucesso! 🚀",
    documentation: "http://localhost:3000/api-docs",
  });
});

app.use("/", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/recurrences", recurrenceRoutes);
app.use("/categories", categoryRoutes);
app.use("/frequencies", frequencyRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`🚀 Servidor ouvindo em http://localhost:${port}`);
  console.log(
    `📚 Documentação disponível em http://localhost:${port}/api-docs`
  );
});
