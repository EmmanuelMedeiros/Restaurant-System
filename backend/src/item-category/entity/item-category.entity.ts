import { IItemCategory } from "src/interface/IItemCategory";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('itemCategory')
export class ItemCategory implements IItemCategory {

    @PrimaryGeneratedColumn({type: "integer"})
    public readonly id: number;

    @Column({type: "varchar", length: "50", unique: true})
    public readonly title: string;
    
    @Column({type: "boolean", default: false})
    public readonly deleted?: boolean;

	constructor(id: number, title: string) {
		this.id = id;
		this.title = title;
        this.deleted = this.deleted
	}

    
} 