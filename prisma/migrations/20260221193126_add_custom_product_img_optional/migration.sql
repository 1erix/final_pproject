-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_food" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
    "kkal" INTEGER NOT NULL,
    "belki" TEXT NOT NULL,
    "zhiri" TEXT NOT NULL,
    "uglevody" TEXT NOT NULL,
    "food_img" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "custom_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "custom_name" TEXT NOT NULL,
    "start_price" TEXT NOT NULL,
    "custom_product_img" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "base" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_base" TEXT NOT NULL,
    "img_of_base" TEXT NOT NULL,
    "price_of_base" TEXT NOT NULL,
    "custom_productsId" INTEGER,
    CONSTRAINT "base_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sauce" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_sauce" TEXT NOT NULL,
    "price_of_souce" TEXT NOT NULL,
    "custom_productsId" INTEGER,
    CONSTRAINT "sauce_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cheese" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_cheese" TEXT NOT NULL,
    "price_of_cheese" TEXT NOT NULL,
    "custom_productsId" INTEGER,
    CONSTRAINT "cheese_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vegetable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_vegetable" TEXT NOT NULL,
    "price_of_vegetables" TEXT NOT NULL,
    "custom_productsId" INTEGER,
    CONSTRAINT "vegetable_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_of_meat" TEXT NOT NULL,
    "price_of_meat" TEXT NOT NULL,
    "custom_productsId" INTEGER,
    CONSTRAINT "meat_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
