import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerated1720485445064 implements MigrationInterface {
  name = 'AutoGenerated1720485445064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'teacher')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL, "microsoft_id" character varying(255), "full_name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "variable" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "default_value" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_f4e200785984484787e6b47e6fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "isValid" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "resetToken" json, CONSTRAINT "UQ_d9fb418d3a96c3ea9d619783355" UNIQUE ("token"), CONSTRAINT "PK_acd6ec48b54150b1736d0b454b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "color" character varying(7) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "case" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_a1b20a2aef6fc438389d2c4aca0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."schedule_status_enum" AS ENUM('Active', 'Inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "job_name" character varying(255) NOT NULL, "job_description" text NOT NULL, "recipients" text NOT NULL, "start_date" date NOT NULL, "start_time" TIME NOT NULL, "end_date" date NOT NULL, "end_time" TIME NOT NULL, "frequency" character varying(255) NOT NULL, "notification" character varying(255) NOT NULL, "status" "public"."schedule_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "caseId" integer, "createdById" integer, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "case_tag" ("id" SERIAL NOT NULL, "case_id" integer, "tag_id" integer, CONSTRAINT "PK_279a544bb4ba2c4d7e2f0917371" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."schedule_activity_log_action_enum" AS ENUM('Created', 'Updated', 'Status changed', 'Deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule_activity_log" ("id" SERIAL NOT NULL, "action" "public"."schedule_activity_log_action_enum" NOT NULL, "details" text NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "scheduleId" integer, CONSTRAINT "PK_f15b570925d1dd12503392726f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "advice" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "case_id" integer, "created_by" integer, CONSTRAINT "PK_e20d6c014c3233fb2d811c441c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "case_response" ("id" SERIAL NOT NULL, "recipient_email" character varying(255) NOT NULL, "content" jsonb NOT NULL, "sent_at" TIMESTAMP NOT NULL DEFAULT now(), "case_id" integer, "user_id" integer, CONSTRAINT "PK_eead54e98490c4eb4bf28e0a207" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "variable" ADD CONSTRAINT "FK_4970331c5e2080a759ee1206bd8" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_7af95683f9d0d8d0a76349611ea" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "case" ADD CONSTRAINT "FK_541abe1313a414447a5dfb44479" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_d047e9b84088b84bf8b720bb956" FOREIGN KEY ("caseId") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_9c94e97526c0fc1a4d4a45af773" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_tag" ADD CONSTRAINT "FK_0d93b3bf85b79d6db6b5d7aafb5" FOREIGN KEY ("case_id") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_tag" ADD CONSTRAINT "FK_17e2a254473816913634836342c" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_activity_log" ADD CONSTRAINT "FK_541e6c243eceff2211398017e02" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advice" ADD CONSTRAINT "FK_b40c35c4b9949b6b25335df80f5" FOREIGN KEY ("case_id") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advice" ADD CONSTRAINT "FK_9a03bb77bdcd862a4ea10665047" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_response" ADD CONSTRAINT "FK_a5d84ba5631d34f9a76707e5122" FOREIGN KEY ("case_id") REFERENCES "case"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_response" ADD CONSTRAINT "FK_5532b94d1af6256974cd75f3639" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "case_response" DROP CONSTRAINT "FK_5532b94d1af6256974cd75f3639"`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_response" DROP CONSTRAINT "FK_a5d84ba5631d34f9a76707e5122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advice" DROP CONSTRAINT "FK_9a03bb77bdcd862a4ea10665047"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advice" DROP CONSTRAINT "FK_b40c35c4b9949b6b25335df80f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_activity_log" DROP CONSTRAINT "FK_541e6c243eceff2211398017e02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_tag" DROP CONSTRAINT "FK_17e2a254473816913634836342c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "case_tag" DROP CONSTRAINT "FK_0d93b3bf85b79d6db6b5d7aafb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_9c94e97526c0fc1a4d4a45af773"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_d047e9b84088b84bf8b720bb956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "case" DROP CONSTRAINT "FK_541abe1313a414447a5dfb44479"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "FK_7af95683f9d0d8d0a76349611ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variable" DROP CONSTRAINT "FK_4970331c5e2080a759ee1206bd8"`,
    );
    await queryRunner.query(`DROP TABLE "case_response"`);
    await queryRunner.query(`DROP TABLE "advice"`);
    await queryRunner.query(`DROP TABLE "schedule_activity_log"`);
    await queryRunner.query(
      `DROP TYPE "public"."schedule_activity_log_action_enum"`,
    );
    await queryRunner.query(`DROP TABLE "case_tag"`);
    await queryRunner.query(`DROP TABLE "schedule"`);
    await queryRunner.query(`DROP TYPE "public"."schedule_status_enum"`);
    await queryRunner.query(`DROP TABLE "case"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "reset_tokens"`);
    await queryRunner.query(`DROP TABLE "variable"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
