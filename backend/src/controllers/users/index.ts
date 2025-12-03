import { Request, Response, NextFunction } from "express";
import { createUser } from "./create/index.js";
import { loginUser } from "./login/index.js";

export class UserController {
  static instance: UserController;

  public static getInstance() {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }
  async create(req: Request, res: Response, next: NextFunction) {
    return createUser(req, res, next);
  }

  async login(req: Request, res: Response, next: NextFunction) {
    return loginUser(req, res, next);
  }
}
