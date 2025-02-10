import { IOrderItem } from "src/interface/IOrderItem";
import { Item } from "src/item/entity/item.entity";
import { Order } from "./order.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class OrderItem implements IOrderItem {

    @PrimaryColumn()
    public readonly uuid: string;

    @ManyToOne(() => Item)
    @JoinColumn({
        name: 'itemID'
    })
    public readonly item: Item;

    @ManyToOne(() => Order)
    public readonly order: Order;

    @Column({type: 'integer'})
    public readonly quantity: number;

	constructor(uuid: string, item: Item, order: Order, quantity: number) {
		this.uuid = uuid;
		this.item = item;
		this.order = order;
		this.quantity = quantity;
	}

}