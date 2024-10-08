import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerated1723720965411 implements MigrationInterface {
    name = 'AutoGenerated1723720965411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variable" ADD "is_permanent" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variable" DROP COLUMN "is_permanent"`);
    }

}
