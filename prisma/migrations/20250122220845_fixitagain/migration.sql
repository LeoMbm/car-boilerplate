/*
  Warnings:

  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `make` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `icon` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `characteristics` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "details" TEXT[],
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "imageUrl",
DROP COLUMN "make",
DROP COLUMN "model",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "characteristics" JSONB NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
