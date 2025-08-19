import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1755588000243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (name) VALUES 
                ('admin'),
                ('client');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM roles WHERE name IN ('admin', 'client');
        `);
  }
}
