-- CreateTable
CREATE TABLE "public"."PerfilHeranca" (
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,

    CONSTRAINT "PerfilHeranca_pkey" PRIMARY KEY ("parentId","childId")
);

-- AddForeignKey
ALTER TABLE "public"."PerfilHeranca" ADD CONSTRAINT "PerfilHeranca_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PerfilHeranca" ADD CONSTRAINT "PerfilHeranca_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
