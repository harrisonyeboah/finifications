/*
  Warnings:

  - Added the required column `condition` to the `StockWatchlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('ABOVE', 'BELOW');

-- AlterTable
ALTER TABLE "StockWatchlist" ADD COLUMN     "condition" "Condition" NOT NULL,
ADD COLUMN     "fulfilled" BOOLEAN NOT NULL DEFAULT false;
