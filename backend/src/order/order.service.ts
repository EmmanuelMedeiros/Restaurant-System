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
import { Item } from 'src/item/entity/item.entity';

const escpos = require('escpos');
escpos.Network = require('escpos-network');

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
                false
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

    async findByTableID(table: Table): Promise<Order[]|null> {
        try {
            const sqlQuery: string = `
                                    select
                    	                "uuid",
                    	                "createdAt",
                    	                "modifiedAt" ,
                    	                "finishedAt" 
                                        from
                                        	"order" o
                                        where
                                        	o."tableId" = $1
                                        order by "createdAt" desc
                                        limit 1
            `
            const fetchOrder = await this.orderRepository.query(sqlQuery, [table.id]);
            return fetchOrder;
        }catch(err) {
            return null;
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
                order: order,
            },
            relations: {
                item: {
                    category: true
                },
                       
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
            this.printBilling(orderItems);
            await queryRunner.manager.update(Order, order.uuid, {
                finishedAt: finishedAtMoment
            });
            await queryRunner.manager.update(Table, order.table, {
                status: TableStatus.SLEEPING
            });
            console.log(orderItems)
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

    async manipulateOrderItem(order: Order, createOrderItemDTO: CreateOrderItemDTO[]): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        const thisOrderItems: OrderItem[]|null = await this.findOrderItems(order);
        const orderItemList: OrderItem[] = [];
        try{
            if(!thisOrderItems || thisOrderItems.length < 1) {
                for(let i: number = 0; i < createOrderItemDTO.length; i++) {
                    orderItemList.push(
                        new OrderItem(crypto.randomUUID(), createOrderItemDTO[i].item, order, createOrderItemDTO[i].quantity)
                    );
                };
            } else {
                for(let i: number = 0; i < createOrderItemDTO.length; i++) {
                    const checkIfItemAlreadyExists: OrderItem|undefined = thisOrderItems.find(x => x.item.id === createOrderItemDTO[i].item.id);
                    if(!checkIfItemAlreadyExists) {
                        if(createOrderItemDTO[i].quantity > 0) {
                            orderItemList.push(
                                new OrderItem(crypto.randomUUID(), createOrderItemDTO[i].item, order, createOrderItemDTO[i].quantity)
                            );
                        };
                    } else {
                        if(createOrderItemDTO[i].quantity > 0) {
                            orderItemList.push(
                                new OrderItem(checkIfItemAlreadyExists.uuid, checkIfItemAlreadyExists.item, order, createOrderItemDTO[i].quantity)
                            )
                        } else {
                            await this.orderItemRepository.remove(checkIfItemAlreadyExists)
                        }
                    };
                };
            }
            await this.orderItemRepository.save(orderItemList);
            return endMessage = {data: orderItemList, status: HttpStatus.OK};
        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    };

    async printBilling(orderItems: OrderItem[]) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};

    
        try {
            const device = new escpos.Network('192.168.0.11', 9100); // Replace with your printer's IP
            const printer = new escpos.Printer(device);

            device.open(function (error) {
                if (error) {
                  console.error("Connection error:", error);
                  return endMessage = {data: error.toString(), status: HttpStatus.BAD_REQUEST};
                };

                let lines: string[] = [];
                let billingPrice: number = 0;
                orderItems.forEach((element) => {
                    lines.push(`  ${element.quantity} ${element.item.name}`.padEnd(20, ' '));
                    billingPrice += (element.item.price * element.quantity);
                });

                lines.push(`      SUBTOTAL:     ${billingPrice.toFixed(2)}`);
                lines.push(`                10% +${(billingPrice * .1).toFixed(2)}`);
                lines.push(`      TOTAL:        ${(billingPrice + (billingPrice * 1)).toFixed(2)}`);

/*                 const lines = [
                    `2 ItemA ----- R$  80.00`,
                    `1 ItemB ----- R$  45.00`,
                    ``,
                    `      SUBTOTAL:     125.00`,
                    `                10% +12.50`,
                    `        TOTAL:   R$ 137,50`
                  ]; */
              
                printer
                  .align('lt')
                  .style('b')
                  .size(.5, .5);

                lines.forEach(line => printer.text(line));

                printer.feed(2)
                .cut()
                .close();
                
            });

            return endMessage = {data: `Sucess on printing order`, status: HttpStatus.OK};
            
        }catch(err) {
            console.log(err);
            return endMessage = {status: HttpStatus.BAD_REQUEST, data: err.toString()}
        }
    }


}
