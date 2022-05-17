/*
  Warnings:

  - Added the required column `exp_at` to the `RefreshTokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshTokens" ADD COLUMN     "exp_at" INTEGER NOT NULL;
