import { MigrationInterface, QueryRunner } from "typeorm";

export class assert_item_id_sequence2044055898139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SELECT setval(pg_get_serial_sequence('"item"', 'id'), (SELECT MAX(id) FROM "item"));
    `);
    await queryRunner.query(`
       SELECT setval(pg_get_serial_sequence('"itemCategory"', 'id'), (SELECT MAX(id) FROM "itemCategory"));
    `);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
