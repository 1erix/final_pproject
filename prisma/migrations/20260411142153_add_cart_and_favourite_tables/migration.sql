-- CreateTable
CREATE TABLE "cart_default" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER,
    CONSTRAINT "cart_default_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favourite_default" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER,
    CONSTRAINT "favourite_default_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_custom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "custom_productsId" INTEGER,
    CONSTRAINT "cart_custom_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favourite_custom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "custom_productsId" INTEGER,
    CONSTRAINT "favourite_custom_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
