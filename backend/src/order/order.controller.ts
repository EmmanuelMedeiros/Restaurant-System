import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';

import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { TableService } from 'src/table/table.service';
import { Table } from 'src/table/entity/table.entity';
import { EndMessage } from 'src/interface/EndMessage';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { OrderItem } from './entity/orderItem.entity';
import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entity/item.entity';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly tableService: TableService,
        private readonly userService: UserService,
        private readonly itemService: ItemService
    ) {};

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createUserDTO: CreateOrderDTO ) {
        const fetchedTable: Table|null = await this.tableService.findOne(createUserDTO.table.id);
        if(!fetchedTable) {
            throw new HttpException(`No table found for this ID`, HttpStatus.NOT_FOUND);
        };
        const fetchedUser: User|null = await this.userService.findOne(createUserDTO.waiter.uuid);
        if(!fetchedUser) {
            throw new HttpException(`No user found for this UUID`, HttpStatus.NOT_FOUND);
        };
        const fetchedItem: Item|null = await this.itemService.findOne(Number(createUserDTO.orderItem.item.id))
        if(!fetchedItem) {
            throw new HttpException(`No user found for this UUID`, HttpStatus.NOT_FOUND);
        };
        const orderItem: OrderItem = {
            id: "",
            item: fetchedItem,
            order: createUserDTO.orderItem.order,
            quantity: createUserDTO.orderItem.quantity
        }
        const createOrder: CreateOrderDTO = new CreateOrderDTO(
            fetchedTable,
            fetchedUser,
            orderItem,
            undefined,
            undefined
        )
        const serviceResponse: EndMessage = await this.orderService.create(createOrder)
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }
}
