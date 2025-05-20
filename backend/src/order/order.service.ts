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

require('dotenv').config();
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
            console.log(err)
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

    async formatLine(qty, name, price) {
        const qtyName = `${qty} ${name}`.padEnd(20, ' ');
        const priceStr = `R$ ${price.toFixed(2)}`.padStart(10, ' ');
        return `${qtyName}-----${priceStr}`;
    }

    async testPrinter() {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        const device = new escpos.Network(process.env.PRINTER_IP, 9100); // Replace with your printer's IP
        const printer = new escpos.Printer(device);
        try {
            device.open(function (error) {
                if (error) {
                  console.error("Connection error:", error);
                  return endMessage = {data: error.toString(), status: HttpStatus.BAD_REQUEST};
                };
                printer.size(.5, .5);
                printer.text('IMPRESSORA FUNCIONANDO!');
                printer
                  .style('b')
                printer.feed(1)
                .cut()
                .close();
            })
            
            printer.close();
            return endMessage = {data: `Sucess on printing order`, status: HttpStatus.OK};
        } catch(err) {
            printer.close();
            console.log(err)
            return endMessage = {data: `fail on printing order: ${err.toString()}`, status: HttpStatus.OK};
        }
    }

    async printBilling(orderItems: OrderItem[]) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};

    
        try {
            const device = new escpos.Network(process.env.PRINTER_IP, 9100); // Replace with your printer's IP
            const printer = new escpos.Printer(device);
            
            device.open(function (error) {
                if (error) {
                  console.error("Connection error:", error);
                  return endMessage = {data: error.toString(), status: HttpStatus.BAD_REQUEST};
                };

                let lines: string[] = [];
                let billingPrice: number = 0;

                printer.text('Qtde.  Item             Valor')
                printer.align('ct')
                printer.text('--------------------')

                orderItems.forEach((element) => {
                    const itemTotal: number = element.quantity * element.item.price;
                    const quantityAndNameLine: string = `${element.quantity.toString().padStart(2, '0')} ${element.item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 16)}`.padEnd(20, ' ');
                    const priceLine:string = `R$ ${itemTotal.toFixed(2)}`.padStart(2, ' ');
                    printer.size(.05, .05)
                    printer.align('lt')
                    printer.text(`${quantityAndNameLine} | ${priceLine}`)
                    printer.align('ct')
                    printer.text('--------------------')
                    billingPrice += (element.item.price * element.quantity);
                });

                printer.align('rt')

                printer.text('');
                printer.text('');
                printer.text(`      SUBTOTAL:     ${billingPrice.toFixed(2)}`);
                printer.text(`                10% +${(billingPrice * .1).toFixed(2)}`);
                printer.text(`      TOTAL:        ${(billingPrice + (billingPrice * .1)).toFixed(2)}`);

                printer.align('ct')
                
                printer.text('')
                printer.text('')
                printer.size(.01, .01)
                printer.text('BAR DO PELADO PONTA GROSSA');
                printer.text('-------')
                printer.text('VOLTE SEMPRE!');

              
                printer
                  .style('b')
                  .text(lines);

                printer.feed(1)
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
