import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertItems1746495013543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO "item" (id, "description", "name", price, "createdAt", "updatedAt", deleted, "itemCategoryUUID") 
                VALUES 
                (1, NULL, 'BACALHAU', 92.00, '2025-05-05', '2025-05-05', false, 1),
                (2, NULL, 'CAMARÃOZADA', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (3, NULL, 'CARNE DE SOL DE BOI (ALMOÇO)', 62.00, '2025-05-05', '2025-05-05', false, 1),
                (4, NULL, 'CARNE DE SOL DE PORCO (ALMOÇO)', 58.00, '2025-05-05', '2025-05-05', false, 1),
                (5, NULL, 'CHARQUE DE PICANHA (INTEIRO) (ALMOÇO)', 95.00, '2025-05-05', '2025-05-05', false, 1),
                (6, NULL, 'CHARQUE DE PICANHA (MEIO) (ALMOÇO)', 70.00, '2025-05-05', '2025-05-05', false, 1),
                (7, NULL, 'FILÉ DE SIRI', 80.00, '2025-05-05', '2025-05-05', false, 1),
                (8, NULL, 'FILÉ DE TILÁPIA', 65.00, '2025-05-05', '2025-05-05', false, 1),
                (9, NULL, 'MISTA BOI E CHARQUE (ALMOÇO)', 120.00, '2025-05-05', '2025-05-05', false, 1),
                (10, NULL, 'MISTA BOI E PORCO (ALMOÇO)', 115.00, '2025-05-05', '2025-05-05', false, 1),
                (11, NULL, 'MISTA PORCO E CHARQUE (ALMOÇO)', 120.00, '2025-05-05', '2025-05-05', false, 1),
                (12, NULL, 'PEIXE FRITO (ALMOÇO)', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (13, NULL, 'PEIXADA', 98.00, '2025-05-05', '2025-05-05', false, 1),
                (14, NULL, 'PEIXE FRITO (MEIO) (ALMOÇO)', 58.00, '2025-05-05', '2025-05-05', false, 1),
                (15, NULL, 'PICANHA (INTEIRO) (ALMOÇO)', 124.00, '2025-05-05', '2025-05-05', false, 1),
                (16, NULL, 'PICANHA (MEIA) (ALMOÇO)', 84.00, '2025-05-05', '2025-05-05', false, 1),
                (17, NULL, 'SURURU AO MOLHO DE COCO (ALMOÇO)', 65.00, '2025-05-05', '2025-05-05', false, 1),
                (18, NULL, 'CARNE DE SOL DE BOI (PF)', 32.00, '2025-05-05', '2025-05-05', false, 5),
                (19, NULL, 'CARNE DE SOL DE PORCO (PF)', 28.00, '2025-05-05', '2025-05-05', false, 5),
                (20, NULL, 'CHARQUE DE PICANHA (PF)', 32.00, '2025-05-05', '2025-05-05', false, 5),
                (21, NULL, 'PICANHA (PF)', 45.00, '2025-05-05', '2025-05-05', false, 5),
                (22, NULL, 'CALDINHO DE SURURU DE CAPOTE', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (23, NULL, 'CALDINHO DE SIRI', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (24, NULL, 'CALDINHO DE FEIJÃO', 11.00, '2025-05-05', '2025-05-05', false, 3),
                (25, NULL, 'ARROZ', 10.00, '2025-05-05', '2025-05-05', false, 6),
                (26, NULL, 'FEIJÃO', 10.00, '2025-05-05', '2025-05-05', false, 6),
                (27, NULL, 'BATATA FRITA', 16.00, '2025-05-05', '2025-05-05', false, 6),
                (28, NULL, 'FAROFA MATUTA', 8.00, '2025-05-05', '2025-05-05', false, 6),
                (29, NULL, 'PIRÃO', 16.00, '2025-05-05', '2025-05-05', false, 6),
                (30, NULL, 'PURÊ', 15.00, '2025-05-05', '2025-05-05', false, 6),
                (31, NULL, 'ARRUMADINHO DE CHARQUE DE PICANHA (TIRA-GOSTO)', 65.00, '2025-05-05', '2025-05-05', false, 2),
                (32, NULL, 'ARRUMADINHO DE BOI (TIRA-GOSTO)', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (33, NULL, 'ARRUMADINHO DE PORCO (TIRA-GOSTO)', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (34, NULL, 'SALADA DE BACALHAU (TIRA-GOSTO)', 75.00, '2025-05-05', '2025-05-05', false, 2),
                (35, NULL, 'CAMARÃO ACEBOLADO (TIRA-GOSTO)', 88.00, '2025-05-05', '2025-05-05', false, 2),
                (36, NULL, 'CARNE DE SOL DE BOI (TIRA-GOSTO)', 54.00, '2025-05-05', '2025-05-05', false, 2),
                (37, NULL, 'CARNE DE SOL DE PORCO (TIRA-GOSTO)', 52.00, '2025-05-05', '2025-05-05', false, 2),
                (38, NULL, 'CHARQUE DE PICANHA (INTEIRO) (TIRA-GOSTO)', 85.00, '2025-05-05', '2025-05-05', false, 2),
                (39, NULL, 'CHARQUE DE PICANHA (MEIO) (TIRA-GOSTO)', 64.00, '2025-05-05', '2025-05-05', false, 2),
                (40, NULL, 'FILÉ DE SIRI (NO COCO) (TIRA-GOSTO)', 70.00, '2025-05-05', '2025-05-05', false, 2),
                (41, NULL, 'FILÉ DE SIRI (NA MANTEIGA) (TIRA-GOSTO)', 70.00, '2025-05-05', '2025-05-05', false, 2),
                (42, NULL, 'FILÉ DE TILÁPIA (TIRA-GOSTO)', 58.00, '2025-05-05', '2025-05-05', false, 2),
                (43, NULL, 'MISTA BOI E CHARQUE (TIRAO-GOSTO)', 110.00, '2025-05-05', '2025-05-05', false, 2),
                (44, NULL, 'MISTA BOI E PORCO (TIRA-GOSTO)', 100.00, '2025-05-05', '2025-05-05', false, 2),
                (45, NULL, 'PEIXE FRITO (TIRA-GOSTO)', 88.00, '2025-05-05', '2025-05-05', false, 2),
                (46, NULL, 'PICANHA (INTEIRO) (TIRA-GOSTO)', 114.00, '2025-05-05', '2025-05-05', false, 2),
                (47, NULL, 'PICANHA (MEIA) (TIRA-GOSTO)', 77.00, '2025-05-05', '2025-05-05', false, 2),
                (48, NULL, 'SURURU AO MOLHO DE COCO (TIRA-GOSTO)', 55.00, '2025-05-05', '2025-05-05', false, 2),
                (49, NULL, 'SIRI DE CORAL', 7.00, '2025-05-05', '2025-05-05', false, 7),
                (50, NULL, 'PATA DE UÇA', 70.00, '2025-05-05', '2025-05-05', false, 7);
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
