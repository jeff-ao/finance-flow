import { CreateUserInput } from "src/validators/users/create/index.js";
import { createUser } from "./create/index.js";
import { findUserByEmail } from "./findByEmail/index.js";

export class UsersService {
  static instance: UsersService;

  public static getInstance() {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }
  async create(data: CreateUserInput) {
    return createUser(data);
  }

  async findByEmail(email: string) {
    return findUserByEmail(email);
  }
}
