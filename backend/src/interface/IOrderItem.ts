import { Item } from "src/item/entity/item.entity";
import { Order } from "src/order/entity/order.entity";

export interface IOrderItem {
    uuid: string,
    order: Order,
    item: Item,
    quantity: number
}