-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "parentID" TEXT;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
