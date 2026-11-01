import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregarUbicacionPublicacion1792584000000 implements MigrationInterface {
  name = 'AgregarUbicacionPublicacion1792584000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "publicaciones" ADD "ubicacion" character varying(80)');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "publicaciones" DROP COLUMN "ubicacion"');
  }
}
