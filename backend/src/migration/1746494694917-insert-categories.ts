import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategories1746494694917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                            insert
                            	into
                            	"itemCategory"(id,
                            	title)
                            values (1,
                            'ALMOÇO'),
                            (2,
                            'TIRA-GOSTO'),
                            (3,
                            'CALDINHO'),
                            (4,
                            'BEBIDAS'),
                            (5,
                            'PRATO FEITO'),
                            (6,
                            'PORÇÕES'),
                            (7,
                            'ENTRADAS'),
                            (8,
                            'DOSES');
                        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
