import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerated1720741349030 implements MigrationInterface {
  name = 'AutoGenerated1720741349030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password_hash" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "password_hash" SET NOT NULL`,
    );
  }
}
