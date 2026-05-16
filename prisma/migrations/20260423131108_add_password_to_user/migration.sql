-- AlterTable
ALTER TABLE "user" ADD COLUMN "password" TEXT;

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "home_number" INTEGER NOT NULL,
    "office_number" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "card_number" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "cvc" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "items" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cart_item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER,
    "customId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER NOT NULL DEFAULT 1,
    "selections" TEXT,
    "customPrice" INTEGER,
    CONSTRAINT "cart_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cart_item_customId_fkey" FOREIGN KEY ("customId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cart_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cart_item" ("customId", "customPrice", "id", "productId", "quantity", "selections", "userId") SELECT "customId", "customPrice", "id", "productId", "quantity", "selections", "userId" FROM "cart_item";
DROP TABLE "cart_item";
ALTER TABLE "new_cart_item" RENAME TO "cart_item";
CREATE TABLE "new_favourite_custom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "custom_productsId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "favourite_custom_custom_productsId_fkey" FOREIGN KEY ("custom_productsId") REFERENCES "custom_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "favourite_custom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_favourite_custom" ("custom_productsId", "id") SELECT "custom_productsId", "id" FROM "favourite_custom";
DROP TABLE "favourite_custom";
ALTER TABLE "new_favourite_custom" RENAME TO "favourite_custom";
CREATE TABLE "new_favourite_default" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "favourite_default_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "favourite_default_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_favourite_default" ("id", "productId") SELECT "id", "productId" FROM "favourite_default";
DROP TABLE "favourite_default";
ALTER TABLE "new_favourite_default" RENAME TO "favourite_default";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");
