-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INPUT', 'OUTPUT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frequencies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "interval_value" INTEGER NOT NULL,
    "interval_unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Frequencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recurrences" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "total_installments" INTEGER,
    "start_date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" "TransactionType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER,
    "frequency_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "installment_number" INTEGER NOT NULL DEFAULT 1,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "recurrence_id" INTEGER,
    "category_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_uuid_key" ON "Categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Recurrences_uuid_key" ON "Recurrences"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_uuid_key" ON "Transactions"("uuid");

-- AddForeignKey
ALTER TABLE "Recurrences" ADD CONSTRAINT "Recurrences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrences" ADD CONSTRAINT "Recurrences_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrences" ADD CONSTRAINT "Recurrences_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "Frequencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_recurrence_id_fkey" FOREIGN KEY ("recurrence_id") REFERENCES "Recurrences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
