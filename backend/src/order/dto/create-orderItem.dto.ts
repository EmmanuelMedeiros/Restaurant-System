import { Item } from "src/item/entity/item.entity";
import { Order } from "../entity/order.entity";
import { IsNegative, IsPositive } from "class-validator";

export class CreateOrderItemDTO {

    public readonly item: Item;

    public readonly quantity: number;

    constructor(item: Item, quantity:number) {
        this.item = item,
        this.quantity = quantity
    }
}