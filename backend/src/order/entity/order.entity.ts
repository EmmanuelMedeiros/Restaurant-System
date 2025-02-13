import { IOrder } from "src/interface/IOrder";
import { Item } from "src/item/entity/item.entity";
import { Table } from "src/table/entity/table.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn, TableForeignKey } from "typeorm";
import { OrderItem } from "./orderItem.entity";

@Entity('order')
export class Order implements IOrder {

    @PrimaryColumn()
    public readonly uuid: string;

    @ManyToOne(() => Table)
    public readonly table: Table;

    @ManyToOne(() => User, {onDelete: "CASCADE"})
    public readonly waiter: User;

    @Column({type: 'timestamp'})
    public readonly createdAt: string;

    @Column({type: "timestamp", nullable: true}) 
    public readonly modifiedAt?: string | undefined;    

    @Column({type: "timestamp", nullable: true})
    public readonly finishedAt?: string | undefined;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.uuid)
    public readonly orderItems: OrderItem[];
    

	constructor(createdAt: string, table: Table, uuid: string, waiter: User, modifiedAt?: string, finishedAt?: string) {
		this.createdAt = createdAt;
		this.table = table;
		this.uuid = uuid;
		this.waiter = waiter;
        this.modifiedAt = modifiedAt;
        this.finishedAt = finishedAt;

	}

}