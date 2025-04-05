import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Table } from './entity/table.entity';
import { CreateTableDTO } from './dto/create-table.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { TableStatus } from 'src/enum/TableStatus';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>
    ) {};
    

    async create(): Promise<EndMessage>{
        let endMessage: EndMessage = {data: '', status: HttpStatus.CREATED};

        try {
            let tableToInsert: CreateTableDTO;
            const maxTableName: {max: number} = await this.tableRepository.query(`select MAX(name) from "table"`);

            if(!maxTableName[0]) {

                tableToInsert = new CreateTableDTO(
                    1,
                    TableStatus.SLEEPING
                );

            } else {

                tableToInsert = new CreateTableDTO(
                    maxTableName[0].max + 1,
                    TableStatus.SLEEPING
                );
            }


            console.log(tableToInsert)

            const table: InsertResult = await this.tableRepository.insert(tableToInsert)
            const insertedTable: Table = new Table(
                table.raw[0].id,
                maxTableName[0].max + 1,
                TableStatus.SLEEPING,
                false
            )
            return endMessage = {data: insertedTable, status: HttpStatus.CREATED};
        }catch(err){
            return endMessage = {data: err.toString(), status: HttpStatus.INTERNAL_SERVER_ERROR};
        }
    }

    async findAll(): Promise<Table[]|null> {
        const tableList: Table[] = await this.tableRepository.find({where: {deleted: false}});
        return tableList;
    }

    async findOne(id: number): Promise<Table|null> {
        const table: Table|null = await this.tableRepository.findOne({
            where: {
                id: id
            }
        })
        return table;
    }

    async delete(table: Table) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}

        try {
            await this.tableRepository.update(table.id, {deleted: true});
            endMessage = {data: table, status: HttpStatus.OK};
        }catch(err) {
            endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
        return endMessage;
    }
}
