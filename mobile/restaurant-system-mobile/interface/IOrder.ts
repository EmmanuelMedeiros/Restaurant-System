import { IOrderItem } from "./IOrderItem"
import { ITable } from "./ITable"
import { IUser } from "./IUser"

export interface IOrder {
    uuid: string,
    createdAt: string,
    modifiedAt?: string,
    finishedAt?: string,
    waiter: IUser,
    table: ITable,
    orderItems: IOrderItem[]
}