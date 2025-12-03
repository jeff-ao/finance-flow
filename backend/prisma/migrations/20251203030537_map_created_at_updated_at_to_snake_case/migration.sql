/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Frequencies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Frequencies` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Recurrences` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Recurrences` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Categories" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Categories" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "Frequencies" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Frequencies" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "Recurrences" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Recurrences" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "Transactions" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Transactions" RENAME COLUMN "updatedAt" TO "updated_at";

-- AlterTable
ALTER TABLE "Users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "Users" RENAME COLUMN "updatedAt" TO "updated_at";
