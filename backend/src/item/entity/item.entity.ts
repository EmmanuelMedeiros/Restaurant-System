import { Length, Min } from "class-validator";
import { IItem } from "src/interface/IItem";
import { ItemCategory } from "src/item-category/entity/item-category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Item implements IItem {

    @PrimaryGeneratedColumn({})
    public readonly id: number;

    @Column({type: 'text', name: "description", nullable: true})
    public readonly description?: string;

    @Column({type: 'varchar', name: "name"})
    @Length(2, 100)
    public readonly name: string;

    @Column({type: 'decimal'})
    @Min(0.1)
    public readonly price: number;

    @Column({type: 'timestamp'})
    public readonly createdAt: string;

    @Column({type: 'timestamp', nullable: true})
    public readonly updatedAt?: string;

    @ManyToOne(() => ItemCategory, (itemCategory) => itemCategory.id)
    @JoinColumn({name: 'itemCategoryUUID'})
    public readonly category: ItemCategory;

    @Column({ "type": "boolean", default: false })
    public readonly deleted?: boolean;

	constructor(category: ItemCategory, id: number, name: string, price: number, createdAt: string, updatedAt?: string, description?: string, deleted?: boolean) {
		this.category = category;
		this.description = description;
		this.id = id;
		this.name = name;
		this.price = price;
        this.createdAt = createdAt,
        this.updatedAt = updatedAt,
        this.description = description,
        this.deleted = deleted
	}

}