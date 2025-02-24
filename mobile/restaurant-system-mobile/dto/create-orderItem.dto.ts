import { IItem } from "@/interface/IItem";

export class CreateOrderItemDTO {
    item: IItem
    quantity: number

	constructor(item: IItem, quantity: number) {
        this.item = item,
        this.quantity = quantity
	}

}