import { Table } from "src/table/entity/table.entity";
import { Order } from "../entity/order.entity";
import { User } from "src/user/entity/user.entity";

import * as moment from 'moment';
import { OrderItem } from "../entity/orderItem.entity";

export class CreateOrderDTO implements Pick<Order, "table"|"waiter"|"createdAt"|"finishedAt"|"modifiedAt"> {

    public readonly table: Table;
    public readonly waiter: User;
    public readonly createdAt: string;
    public readonly orderItem: OrderItem;
    public readonly finishedAt?: string;
    public readonly modifiedAt?: string;

	constructor(table: Table, waiter: User, orderItem: OrderItem, finishedAt?: string , modifiedAt?: string) {
        this.table = table;
        this.waiter = waiter;
        this.orderItem = orderItem,
		this.createdAt = moment().format('YYYY/MM/DD HH:mm:ss');
		this.finishedAt = finishedAt;
		this.modifiedAt = modifiedAt;
        this.finishedAt = finishedAt,
        this.modifiedAt = modifiedAt
	}

}