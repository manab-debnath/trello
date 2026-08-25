-- CreateTable
CREATE TABLE "pending_member" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationID" TEXT NOT NULL,

    CONSTRAINT "pending_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_member_email_key" ON "pending_member"("email");

-- AddForeignKey
ALTER TABLE "pending_member" ADD CONSTRAINT "pending_member_organizationID_fkey" FOREIGN KEY ("organizationID") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
