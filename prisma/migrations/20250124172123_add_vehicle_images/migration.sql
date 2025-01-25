/*
  Warnings:

  - You are about to drop the column `image` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "image",
ADD COLUMN     "additionalImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mainImage" TEXT NOT NULL DEFAULT '/img/placeholder.svg';
