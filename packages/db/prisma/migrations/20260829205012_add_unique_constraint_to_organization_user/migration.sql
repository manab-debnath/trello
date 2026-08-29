/*
  Warnings:

  - A unique constraint covering the columns `[userID,organizationID]` on the table `organization_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organization_user_userID_organizationID_key" ON "organization_user"("userID", "organizationID");
