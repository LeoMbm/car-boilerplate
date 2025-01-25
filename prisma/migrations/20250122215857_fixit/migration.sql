/*
  Warnings:

  - The `featuredServices` column on the `SiteSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `featuredVehicles` column on the `SiteSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `description` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "featuredServices",
ADD COLUMN     "featuredServices" INTEGER[],
DROP COLUMN "featuredVehicles",
ADD COLUMN     "featuredVehicles" INTEGER[];
