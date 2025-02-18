import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';
import { EndMessage } from 'src/interface/EndMessage';

import * as crypto from 'crypto';
import * as moment from 'moment';

import { OrderItem } from './entity/orderItem.entity';
import { TableStatus } from 'src/enum/TableStatus';
import { Table } from 'src/table/entity/table.entity';
import { CreateOrderItemDTO } from './dto/create-orderItem.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>,
        private dataSource: DataSource
    ) {};

    async create(createOrderDTO: CreateOrderDTO): Promise<EndMessage> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {

            const updatedTable: Table = new Table(
                createOrderDTO.table.id,
                createOrderDTO.table.name,
                TableStatus.BUSY,
            )
            const order: Order = new Order(
                createOrderDTO.createdAt,
                updatedTable,
                crypto.randomUUID(),
                createOrderDTO.waiter,
                undefined,
                undefined
            )
            const orderItemList: OrderItem[] = []
            createOrderDTO.orderItemList.forEach((element) => {
                orderItemList.push(
                    new OrderItem(crypto.randomUUID(), element.item, order, element.quantity)
                )
            })
            await queryRunner.manager.insert(Order, order);
            await queryRunner.manager.insert(OrderItem, orderItemList);
            await queryRunner.manager.update(Table, order.table.id, updatedTable)
            await queryRunner.commitTransaction();
            return endMessage = {data: order, status: HttpStatus.CREATED};
        }catch(err) {
            await queryRunner.rollbackTransaction();
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }

    async findOne(uuid: string): Promise<Order|null> {
        const user: Order|null = await this.orderRepository.findOne({
            where: {
                uuid: uuid
            },
            relations: {
                table: true,
                waiter: true
            }
        })
        return user;
    }

    async deleteOne(order: Order): Promise<EndMessage> {
        let endMessage: EndMessage = {status: HttpStatus.OK, data: ''};
        try {
            await this.orderRepository.delete(order.uuid);
            await this.tableRepository.update(order.table, {status: TableStatus.SLEEPING})
            return endMessage = {status: HttpStatus.OK, data: order}
        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }

    async findOrderItems(order: Order) {
        const orderItems: OrderItem[]|null = await this.orderItemRepository.find({
            where: {
                order: order
            },
            relations: {
                item: true            
            }
        })
        return orderItems;
    }

    async finishOrder(order: Order, orderItems: OrderItem[]): Promise<EndMessage> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const finishedAtMoment: string = moment().format("YYYY/MM/DD hh:mm:ss")
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        try {
            await queryRunner.manager.update(Order, order.uuid, {
                finishedAt: finishedAtMoment
            });
            await queryRunner.manager.update(Table, order.table, {
                status: TableStatus.SLEEPING
            });
            await queryRunner.commitTransaction();
            const sendBackOrder: Order = {
                createdAt: order.createdAt,
                orderItems: order.orderItems,
                table: order.table,
                uuid: order.uuid,
                waiter: order.waiter,
                finishedAt: finishedAtMoment,
                modifiedAt: order.modifiedAt
            }
            return endMessage = {data: [{order: sendBackOrder, orderItems: orderItems}], status: HttpStatus.OK};
        }catch(err) {
            await queryRunner.rollbackTransaction();
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }

/*     async manipulateOrderItem(order: Order, orderItem: CreateOrderItemDTO[]) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        try {
            const thisOrderItems: OrderItem[]|null = await this.findOrderItems(order);
            const specificOrderItem: OrderItem|undefined = thisOrderItems.find(x => x.item.id === orderItem.item.id);
            if(specificOrderItem && orderItem.quantity > 0) {
                await this.orderItemRepository.query(`update
                                                    	order_item
                                                    set
                                                    	quantity = $1
                                                    where
                                                    	"orderUuid" = $2
                                                    AND
                                                        "itemID" = $3`, [orderItem.quantity, order.uuid, orderItem.item.id]);
                await this.orderRepository.update(order.uuid, {
                    modifiedAt: moment().format('YYYY/MM/DD HH:mm:ss')
                })
                return endMessage = {data: orderItem, status: HttpStatus.OK};
            } else if(specificOrderItem && orderItem.quantity === 0) {
                await this.orderItemRepository.delete(specificOrderItem.uuid)
                await this.orderRepository.update(order.uuid, {
                    modifiedAt: moment().format('YYYY/MM/DD HH:mm:ss')
                })
                return endMessage = {data: orderItem, status: HttpStatus.OK};
            } else if(orderItem.quantity > 1){
                const itemToInsert: OrderItem = new OrderItem(
                    crypto.randomUUID(),
                    orderItem.item,
                    order,
                    orderItem.quantity
                )
                await this.orderItemRepository.insert(itemToInsert);
                await this.orderRepository.update(order.uuid, {
                    modifiedAt: moment().format('YYYY/MM/DD HH:mm:ss')
                })
                return endMessage = {data: itemToInsert, status: HttpStatus.OK};
            } else {
                return endMessage = {data: `To insert a new item, it's quantity must be above 0`, status: HttpStatus.BAD_REQUEST};
            }

        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    } */

}
