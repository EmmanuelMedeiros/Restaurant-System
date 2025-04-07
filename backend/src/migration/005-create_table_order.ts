import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOrder1844055898139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE public."order" (
	                "uuid" varchar NOT NULL,
	                "createdAt" timestamp NOT NULL,
	                "modifiedAt" timestamp NULL,
	                "finishedAt" timestamp NULL,
	                "tableId" int4 NULL,
	                "waiterUuid" varchar NULL,
	                CONSTRAINT "PK_ba94d4066f76b66d3fe0b94c283" PRIMARY KEY (uuid)
                );


                ALTER TABLE public."order" ADD CONSTRAINT "FK_a5724f0cb31384167455be5bdf8" FOREIGN KEY ("waiterUuid") REFERENCES public."user"("uuid") ON DELETE CASCADE;
                ALTER TABLE public."order" ADD CONSTRAINT "FK_a9757413db9333d4bb21a2a42aa" FOREIGN KEY ("tableId") REFERENCES public."table"(id);
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
