-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "borderRadius" TEXT NOT NULL,
    "socialMedia" JSONB NOT NULL,
    "featuredServices" JSONB NOT NULL,
    "featuredVehicles" JSONB NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "showLogo" BOOLEAN NOT NULL,
    "showTitle" BOOLEAN NOT NULL,
    "metadata" JSONB NOT NULL,
    "logoSize" INTEGER NOT NULL,
    "colorTemplate" TEXT NOT NULL,
    "lightModeColors" JSONB NOT NULL,
    "darkModeColors" JSONB NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
