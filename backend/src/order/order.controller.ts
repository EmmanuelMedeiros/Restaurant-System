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
import { Order } from './entity/order.entity';
import { TableStatus } from 'src/enum/TableStatus';
import { Role } from 'src/enum/Role';
import { UpdateItemDTO } from 'src/item/dto/update.item.dto';
import { CreateOrderItemDTO } from './dto/create-orderItem.dto';

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
    async create(@Body() createOrderDTO: CreateOrderDTO ) {
        const fetchedTable: Table|null = await this.tableService.findOne(createOrderDTO.table.id);
        if(!fetchedTable) {
            throw new HttpException(`No table found for this ID`, HttpStatus.NOT_FOUND);
        };
        if(fetchedTable.status === TableStatus.BUSY) {
            throw new HttpException(`This table already has an order in running`, HttpStatus.BAD_REQUEST)
        };
        const fetchedUser: User|null = await this.userService.findOne(createOrderDTO.waiter.uuid);
        if(!fetchedUser) {
            throw new HttpException(`No user found for this UUID`, HttpStatus.NOT_FOUND);
        };
        const fetchedItem: Item|null = await this.itemService.findOne(Number(createOrderDTO.orderItem.item.id))
        if(!fetchedItem) {
            throw new HttpException(`No user found for this UUID`, HttpStatus.NOT_FOUND);
        };
        const orderItem: OrderItem = {
            uuid: "",
            item: fetchedItem,
            order: createOrderDTO.orderItem.order,
            quantity: createOrderDTO.orderItem.quantity
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

    @Get("/:uuid")
    async findOne(@Param("uuid") uuid:string) {
        const order: Order|null = await this.orderService.findOne(uuid)
        if(!order) {
            throw new HttpException("No order found for this UUID", HttpStatus.NOT_FOUND);
        }
        return order;
    }

    @Get("/order-items/:uuid")
    async findOrderItems(@Param("uuid") uuid:string) {
        const order: Order|null = await this.orderService.findOne(uuid)
        if(!order) {
            throw new HttpException("No order found for this UUID", HttpStatus.NOT_FOUND);
        };
        const orderItems: OrderItem[]|null = await this.orderService.findOrderItems(order);
        if(!orderItems ||orderItems.length < 1) {
            throw new HttpException("No order items found!", HttpStatus.NOT_FOUND);
        };
        return orderItems;
    }

    @Put("/finish/:uuid")
    async finish(@Param("uuid") uuid:string) {
        const order: Order|null = await this.orderService.findOne(uuid)
        if(!order) {
            throw new HttpException("No order found for this UUID", HttpStatus.NOT_FOUND);
        };
        if(order.finishedAt) {
            throw new HttpException("This order is already finished", HttpStatus.BAD_REQUEST);
        }
        if(order.table.status !== TableStatus.BUSY) {
            throw new HttpException("This table has no active order", HttpStatus.BAD_REQUEST);
        }
        const orderItems: OrderItem[]|null = await this.orderService.findOrderItems(order);
        if(!orderItems ||orderItems.length < 1) {
            throw new HttpException("No order items found!", HttpStatus.NOT_FOUND);
        };
        const serviceResponse: EndMessage = await this.orderService.finishOrder(order, orderItems);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }

    @HttpCode(HttpStatus.OK)
    @Post('/manipulate_order_item/:uuid')
    async manipulateOrderItem(@Param("uuid") uuid: string, @Body() orderItem: CreateOrderItemDTO) {
        const fetchedOrder: Order|null = await this.orderService.findOne(uuid)
        console.log(fetchedOrder)
        if(!fetchedOrder) {
            throw new HttpException("No order found for this UUID", HttpStatus.NOT_FOUND);
        };
        if(fetchedOrder.finishedAt) {
            throw new HttpException("This order is already finished", HttpStatus.BAD_REQUEST);
        };
        const fetchedItem: Item|null = await this.itemService.findOne(orderItem.item.id);
        if(!fetchedItem) {
            throw new HttpException("No item found for this ID", HttpStatus.NOT_FOUND);
        };
        const serviceResponse: EndMessage = await this.orderService.manipulateOrderItem(fetchedOrder, orderItem);

    }
    
}
