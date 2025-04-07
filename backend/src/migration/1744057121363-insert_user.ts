import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertUser1744057121363 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                insert
                	into
                	"user"(uuid,
                	email,
                	role,
                	password)
                values('dfd36b3b-f40b-42d9-ab51-aa1a8460cea9',
                'admin@email.com',
                'admin',
                '$2b$04$gy5PYtrwHBXhIMbRvBa8xuqDoG6P/wZiCUJEyocROzAO6cHE1jH6u')
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
