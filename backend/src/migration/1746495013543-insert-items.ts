import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertItems1746495013543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO "item" (id, "description", "name", price, "createdAt", "updatedAt", deleted, "itemCategoryUUID") 
                VALUES 
                (1, NULL, 'BACALHAU', 92.00, '2025-05-05', '2025-05-05', false, 1),
                (2, NULL, 'CAMARÃOZADA', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (3, NULL, 'CARNE DE SOL DE BOI', 62.00, '2025-05-05', '2025-05-05', false, 1),
                (4, NULL, 'CARNE DE SOL DE PORCO', 58.00, '2025-05-05', '2025-05-05', false, 1),
                (5, NULL, 'CHARQUE DE PICANHA (INTEIRO)', 95.00, '2025-05-05', '2025-05-05', false, 1),
                (6, NULL, 'CHARQUE DE PICANHA (MEIO)', 70.00, '2025-05-05', '2025-05-05', false, 1),
                (7, NULL, 'FILÉ DE SIRI', 80.00, '2025-05-05', '2025-05-05', false, 1),
                (8, NULL, 'FILÉ DE TILÁPIA', 65.00, '2025-05-05', '2025-05-05', false, 1),
                (9, NULL, 'MISTA BOI E CHARQUE', 120.00, '2025-05-05', '2025-05-05', false, 1),
                (10, NULL, 'MISTA BOI E PORCO', 115.00, '2025-05-05', '2025-05-05', false, 1),
                (11, NULL, 'MISTA PORCO E CHARQUE', 120.00, '2025-05-05', '2025-05-05', false, 1),
                (12, NULL, 'PEIXE FRITO', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (13, NULL, 'PEIXADA', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (14, NULL, 'PEIXE FRITO (MEIO)', 58.00, '2025-05-05', '2025-05-05', false, 1),
                (15, NULL, 'PICANHA (INTEIRO)', 124.00, '2025-05-05', '2025-05-05', false, 1),
                (16, NULL, 'PICANHA (MEIA)', 84.00, '2025-05-05', '2025-05-05', false, 1),
                (17, NULL, 'SURURU AO MOLHO DE COCO', 65.00, '2025-05-05', '2025-05-05', false, 1),
                (18, NULL, 'CARNE DE SOL DE BOI', 32.00, '2025-05-05', '2025-05-05', false, 5),
                (19, NULL, 'CARNE DE SOL DE PORCO', 28.00, '2025-05-05', '2025-05-05', false, 5),
                (20, NULL, 'CHARQUE DE PICANHA', 32.00, '2025-05-05', '2025-05-05', false, 5),
                (21, NULL, 'PICANHA', 45.00, '2025-05-05', '2025-05-05', false, 5),
                (22, NULL, 'CALDINHO DE SURURU DE CAPOTE', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (23, NULL, 'CALDINHO DE SIRI', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (24, NULL, 'CALDINHO DE FEIJÃO', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (25, NULL, 'ARROZ', 10.00, '2025-05-05', '2025-05-05', false, 6),
                (26, NULL, 'FEIJÃO', 10.00, '2025-05-05', '2025-05-05', false, 6),
                (27, NULL, 'BATATA FRITA', 16.00, '2025-05-05', '2025-05-05', false, 6),
                (28, NULL, 'FAROFA MATUTA', 8.00, '2025-05-05', '2025-05-05', false, 6),
                (29, NULL, 'PIRÃO', 16.00, '2025-05-05', '2025-05-05', false, 6),
                (30, NULL, 'PURÊ', 15.00, '2025-05-05', '2025-05-05', false, 6),
                (31, NULL, 'ARRUMADINHO DE CHARQUE DE PICANHA', 65.00, '2025-05-05', '2025-05-05', false, 2),
                (32, NULL, 'ARRUMADINHO DE BOI', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (33, NULL, 'ARRUMADINHO DE PORCO', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (34, NULL, 'SALADA DE BACALHAU', 75.00, '2025-05-05', '2025-05-05', false, 2),
                (35, NULL, 'CAMARÃO ACEBOLADO', 88.00, '2025-05-05', '2025-05-05', false, 2),
                (36, NULL, 'CARNE DE SOL DE BOI', 54.00, '2025-05-05', '2025-05-05', false, 2),
                (37, NULL, 'CARNE DE SOL DE PORCO', 52.00, '2025-05-05', '2025-05-05', false, 2),
                (38, NULL, 'CHARQUE DE PICANHA (INTEIRO)', 85.00, '2025-05-05', '2025-05-05', false, 2),
                (39, NULL, 'CHARQUE DE PICANHA (MEIO)', 64.00, '2025-05-05', '2025-05-05', false, 2),
                (40, NULL, 'FILÉ DE SIRI (NO COCO)', 70.00, '2025-05-05', '2025-05-05', false, 2),
                (41, NULL, 'FILÉ DE SIRI (NA MANTEIGA)', 70.00, '2025-05-05', '2025-05-05', false, 2),
                (42, NULL, 'FILÉ DE TILÁPIA', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (43, NULL, 'MISTA BOI E CHARQUE', 110.00, '2025-05-05', '2025-05-05', false, 2),
                (44, NULL, 'MISTA BOI E PORCO', 100.00, '2025-05-05', '2025-05-05', false, 2),
                (45, NULL, 'PEIXE FRITO', 88.00, '2025-05-05', '2025-05-05', false, 2),
                (46, NULL, 'PICANHA (INTEIRO)', 114.00, '2025-05-05', '2025-05-05', false, 2),
                (47, NULL, 'PICANHA (MEIA)', 77.00, '2025-05-05', '2025-05-05', false, 2),
                (48, NULL, 'SURURU AO MOLHO DE COCO', 55.00, '2025-05-05', '2025-05-05', false, 2);
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
