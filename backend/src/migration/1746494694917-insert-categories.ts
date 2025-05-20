import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertCategories1746494694917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                            insert
                            	into
                            	"itemCategory"(id,
                            	title)
                            values (1,
                            'ALMOÇOS'),
                            (2,
                            'TIRA-GOSTO'),
                            (3,
                            'CALDINHOS'),
                            (4,
                            'BEBIDAS'),
                            (5,
                            'PRATOS FEITOS'),
                            (6,
                            'PORÇÕES'),
                            (7,
                            'ENTRADAS'),
                            (8,
                            'DOSES'),
                            (9,
                            'CERVEJAS');
                        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
