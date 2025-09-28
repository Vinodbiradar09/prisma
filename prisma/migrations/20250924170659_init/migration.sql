-- CreateTable
CREATE TABLE "public"."Vinod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "cgpa" DECIMAL(65,30) NOT NULL,
    "averageAttendance" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" BYTEA NOT NULL,
    "image" BYTEA NOT NULL,

    CONSTRAINT "Vinod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vinod_email_key" ON "public"."Vinod"("email");
