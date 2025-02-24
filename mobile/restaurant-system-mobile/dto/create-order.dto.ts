import { IOrderItem } from "@/interface/IOrderItem"
import { CreateOrderItemDTO } from "./create-orderItem.dto"

export class CreateOrderDTO {

    private table: {id: number}
    private waiter: {uuid: string}
    private orderItemList: CreateOrderItemDTO[]
    constructor(table: {id: number}, waiter: {uuid: string}, orderItemList: CreateOrderItemDTO[]) {
        this.table = table,
        this.waiter = waiter,
        this.orderItemList = orderItemList
    };
}