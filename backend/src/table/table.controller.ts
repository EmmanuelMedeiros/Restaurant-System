import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDTO } from './dto/create-table.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { Table } from './entity/table.entity';
import { UserRoleGuard } from 'src/common/guard/userRole.guard';
import { Role } from 'src/enum/Role';

@UseGuards(new UserRoleGuard([Role.WAITER, Role.ADMIN]))
@Controller('table')
export class TableController {
    constructor(private readonly tableService: TableService) {};

    @UseGuards(new UserRoleGuard([Role.ADMIN]))
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create() {
        const serviceResponse: EndMessage = await this.tableService.create();
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }  

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll() {
        const tableList: Table[]|null = await this.tableService.findAll();
        if(!tableList || tableList.length < 1) {
            throw new HttpException("No table found", HttpStatus.NOT_FOUND);
        }
        return tableList;
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async findOne(@Param('id') id: number) {
        const table: Table|null = await this.tableService.findOne(id)
        if(!table) {
            throw new HttpException("No table found for this ID", HttpStatus.NOT_FOUND);
        }
        return table;
    }

    @UseGuards(new UserRoleGuard([Role.ADMIN]))
    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async delete(@Param('id') id: number) {
        const table: Table|null = await this.tableService.findOne(id)
        if(!table) {
            throw new HttpException("No table found for this ID", HttpStatus.NOT_FOUND);
        };
        const serviceResponse: EndMessage = await this.tableService.delete(table);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }
}
