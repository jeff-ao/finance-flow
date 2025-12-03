import "dotenv/config";
import { PrismaClient } from "generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || "";

const pool = new Pool({ connectionString });
const prismaAdapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter: prismaAdapter,
});

export { prisma };
