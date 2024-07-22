import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGenerated1721583188384 implements MigrationInterface {
    name = 'AutoGenerated1721583188384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recent_search" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "case_id" integer, CONSTRAINT "PK_028dfa7d985553e500797e1b8c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recent_search" ADD CONSTRAINT "FK_bfea34f3d47a232ab0fa5770d8d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recent_search" ADD CONSTRAINT "FK_aa9c0758d0ac80ec13968d60dc2" FOREIGN KEY ("case_id") REFERENCES "case"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recent_search" DROP CONSTRAINT "FK_aa9c0758d0ac80ec13968d60dc2"`);
        await queryRunner.query(`ALTER TABLE "recent_search" DROP CONSTRAINT "FK_bfea34f3d47a232ab0fa5770d8d"`);
        await queryRunner.query(`DROP TABLE "recent_search"`);
    }

}
