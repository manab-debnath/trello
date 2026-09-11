/*
  Warnings:

  - A unique constraint covering the columns `[boardId,status]` on the table `section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "section_boardId_status_key" ON "section"("boardId", "status");
