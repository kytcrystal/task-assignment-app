/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Developer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Developer_name_key" ON "Developer"("name");
