import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOrderItem1944055898139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE public.orderItem (
	                "uuid" varchar NOT NULL,
	                quantity int4 NOT NULL,
	                "itemID" int4 NULL,
	                "orderUuid" varchar NULL,
	                CONSTRAINT "PK_8240c9a4e6f95be0888aebe3ce2" PRIMARY KEY (uuid)
                );

                ALTER TABLE public.orderItem ADD CONSTRAINT "FK_133d0d8f68fc4176e552dc691c3" FOREIGN KEY ("itemID") REFERENCES public.item(id);
                ALTER TABLE public.orderItem ADD CONSTRAINT "FK_c9a6e34ffba680b551e9b1fb386" FOREIGN KEY ("orderUuid") REFERENCES public."order"("uuid") ON DELETE CASCADE;
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
