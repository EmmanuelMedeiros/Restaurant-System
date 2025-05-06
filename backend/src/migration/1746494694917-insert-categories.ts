import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategories1746494694917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                            insert
                            	into
                            	"itemCategory"(id,
                            	title)
                            values (1,
                            'Almoço'),
                            (2,
                            'Tira-gosto'),
                            (3,
                            'Caldinho'),
                            (4,
                            'Bebidas'),
                            (5,
                            'PRATO FEITO'),
                            (6,
                            'PORÇÕES')
                        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
