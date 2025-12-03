import "dotenv/config";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/Users/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ message: "Servidor Express está rodando com sucesso! 🚀" });
});

app.use("/", userRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`🚀 Servidor ouvindo em http://localhost:${port}`);
});
