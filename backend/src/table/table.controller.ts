import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDTO } from './dto/create-table.dto';
import { EndMessage } from 'src/interface/EndMessage';

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
}
