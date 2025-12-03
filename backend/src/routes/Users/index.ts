import { Router } from "express";
import { UserController } from "src/controllers/users/index.js";

const router = Router();
const userController = UserController.getInstance();

router.post("/users", (req, res, next) =>
  userController.create(req, res, next)
);

router.post("/login", (req, res, next) => userController.login(req, res, next));

export default router;
