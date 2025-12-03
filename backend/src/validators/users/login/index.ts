import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  password: z.string().nonempty("Senha é obrigatória"),
});
