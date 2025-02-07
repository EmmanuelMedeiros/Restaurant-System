import { IItemCategory } from "src/interface/IItemCategory";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('itemCategory')
export class ItemCategory implements IItemCategory {

    @PrimaryGeneratedColumn({type: "integer"})
    public readonly id: number;

    @Column({type: "varchar", length: "50", unique: true})
    public readonly title: string;

	constructor(id: number, title: string) {
		this.id = id;
		this.title = title;
	}

    
} 