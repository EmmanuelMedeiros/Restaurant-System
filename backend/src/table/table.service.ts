import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Table } from './entity/table.entity';
import { CreateTableDTO } from './dto/create-table.dto';
import { EndMessage } from 'src/interface/EndMessage';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>
    ) {};

    async create(createTableDTO: CreateTableDTO): Promise<EndMessage>{
        let endMessage: EndMessage = {data: '', status: HttpStatus.CREATED};
        console.log(createTableDTO.name)
        try {
            const tableToInsert: Table = new Table(
                0,
                createTableDTO.name
            )
            const table: InsertResult = await this.tableRepository.insert(tableToInsert);
            const insertedTable: Table = new Table(
                table.raw[0].id,
                createTableDTO.name
            )
            return endMessage = {data: insertedTable, status: HttpStatus.CREATED};
        }catch(err){
            return endMessage = {data: err.toString(), status: HttpStatus.INTERNAL_SERVER_ERROR};
        }
    }
}
