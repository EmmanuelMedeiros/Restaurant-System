import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableItem11744055871190 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `    
                CREATE TABLE public.item (
                	id serial4 NOT NULL,
                	description text NULL,
                	"name" varchar NOT NULL,
                	price numeric NOT NULL,
                	"createdAt" timestamp NOT NULL,
                	"updatedAt" timestamp NULL,
                	deleted bool DEFAULT false NOT NULL,
                	"itemCategoryUUID" int4 NULL,
                	CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY (id),
                	CONSTRAINT "UQ_c6ae12601fed4e2ee5019544ddf" UNIQUE (name)
                );

                ALTER TABLE public.item ADD CONSTRAINT "FK_228754bcf5a036a272f46413be1" FOREIGN KEY ("itemCategoryUUID") REFERENCES public."itemCategory"(id);
            `
            )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
