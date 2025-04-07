import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTable1744055898139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE public."table" (
	        id serial4 NOT NULL,
	        "name" int4 NOT NULL,
	        status public."table_status_enum" NOT NULL,
	        deleted bool DEFAULT false NOT NULL,
	        CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY (id),
	        CONSTRAINT "UQ_2cb0b78846e0a65d35a4cd02d3c" UNIQUE (name)
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
