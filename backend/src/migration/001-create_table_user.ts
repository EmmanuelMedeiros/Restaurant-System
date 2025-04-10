import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUser1644055871184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE public."user" (
	            "uuid" varchar NOT NULL,
	            email varchar(100) NOT NULL,
	            "role" varchar NOT NULL,
	            "password" text NOT NULL,
	            CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY (uuid),
	            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
                );
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
