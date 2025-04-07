import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableItemCategory1744055871184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TABLE public."itemCategory" (
	            id serial4 NOT NULL,
	            title varchar(50) NOT NULL,
	            deleted bool DEFAULT false NOT NULL,
	            CONSTRAINT "PK_8c15b00bc77d2211b8a3760f1da" PRIMARY KEY (id),
	            CONSTRAINT "UQ_4a1522b3d39f47f711bc43fd29e" UNIQUE (title)
            );
            
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
