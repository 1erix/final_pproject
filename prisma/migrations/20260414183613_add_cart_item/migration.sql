-- CreateTable
CREATE TABLE "cart_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER,
    "customId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "cart_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cart_item_customId_fkey" FOREIGN KEY ("customId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
