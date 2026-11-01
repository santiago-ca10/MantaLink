import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregarCalificaciones1792584000002 implements MigrationInterface {
  name = 'AgregarCalificaciones1792584000002';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "calificaciones" (
      "id" SERIAL NOT NULL,
      "puntuacion" SMALLINT NOT NULL,
      "creadoEn" TIMESTAMP NOT NULL DEFAULT now(),
      "votanteId" uuid NOT NULL,
      "productorId" uuid NOT NULL,
      CONSTRAINT "PK_calificaciones_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_calificaciones_votante" FOREIGN KEY ("votanteId") REFERENCES "usuarios"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_calificaciones_productor" FOREIGN KEY ("productorId") REFERENCES "usuarios"("id") ON DELETE CASCADE,
      CONSTRAINT "CHK_calificaciones_puntuacion" CHECK ("puntuacion" BETWEEN 1 AND 5)
    )`);
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_calificacion_votante_productor" ON "calificaciones" ("votanteId", "productorId")');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "calificaciones"');
  }
}
