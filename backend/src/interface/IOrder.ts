import { OrderItem } from "src/order/entity/orderItem.entity";
import { Table } from "src/table/entity/table.entity";
import { User } from "src/user/entity/user.entity";

export interface IOrder {
    uuid: string,
    createdAt: string,
    modifiedAt?: string,
    finishedAt?: string,
    waiter: User,
    table: Table,
    orderItems: OrderItem[]
}