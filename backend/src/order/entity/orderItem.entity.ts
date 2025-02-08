import { IOrderItem } from "src/interface/IOrderItem";
import { Item } from "src/item/entity/item.entity";
import { Order } from "./order.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class OrderItem implements IOrderItem {

    @PrimaryColumn()
    public readonly id: string;

    @OneToOne(() => Item)
    @JoinColumn({
        name: 'itemID'
    })
    public readonly item: Item;

    @ManyToOne(() => Order)
    public readonly order: Order;

    @Column({type: 'integer'})
    public readonly quantity: number;

	constructor(id: string, item: Item, order: Order, quantity: number) {
		this.id = id;
		this.item = item;
		this.order = order;
		this.quantity = quantity;
	}

}