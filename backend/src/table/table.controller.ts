import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDTO } from './dto/create-table.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { Table } from './entity/table.entity';

@Controller('table')
export class TableController {
    constructor(private readonly tableService: TableService) {};

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() table: CreateTableDTO) {
        const serviceResponse: EndMessage = await this.tableService.create(table);
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }  

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async findOne(@Param('id') uuid: number) {
        const table: Table|null = await this.tableService.findOne(uuid)
        if(!table) {
            throw new HttpException("No table found for this UUID", HttpStatus.NOT_FOUND);
        }
        return table;
    }
}
