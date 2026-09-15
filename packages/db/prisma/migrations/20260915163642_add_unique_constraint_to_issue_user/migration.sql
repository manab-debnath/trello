/*
  Warnings:

  - A unique constraint covering the columns `[issueID,userID]` on the table `issue_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "issue_user_issueID_userID_key" ON "issue_user"("issueID", "userID");
