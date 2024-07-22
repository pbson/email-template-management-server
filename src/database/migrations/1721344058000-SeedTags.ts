import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTags1721344058000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO tag (name, color, created_at, updated_at) VALUES 
      ('school', '#FF5733', NOW(), NOW()), 
      ('studentadvice', '#33FF57', NOW(), NOW()), 
      ('coursequery', '#3357FF', NOW(), NOW()), 
      ('registration', '#F333FF', NOW(), NOW()), 
      ('fees', '#33FFF3', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM tag WHERE name IN ('school', 'studentadvice', 'coursequery', 'registration', 'fees')
    `);
  }
}
