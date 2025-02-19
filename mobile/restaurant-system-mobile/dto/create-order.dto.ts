import { IOrderItem } from "@/interface/IOrderItem"

export class CreateOrderDTO {

    private table: {id: number}
    private waiter: {uuid: string}
    private orderItemList: IOrderItem[]
    constructor(table: {id: number}, waiter: {uuid: string}, orderItemList: IOrderItem[]) {
        this.table = table,
        this.waiter = waiter,
        this.orderItemList = orderItemList
    };
}