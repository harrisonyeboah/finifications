-- CreateTable
CREATE TABLE "ResetCodes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "resetCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetCodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResetCodes" ADD CONSTRAINT "ResetCodes_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
