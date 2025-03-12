import { TableStatus } from "src/enum/TableStatus";
import { ITable } from "src/interface/ITable";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('table')
export class Table implements ITable {

    @PrimaryGeneratedColumn({type: "integer"})
    public readonly id: number;

    @Column({type: "integer", unique: true})
    public readonly name: number;

    @Column({type: 'enum', enum: TableStatus})
    public readonly status: TableStatus

	constructor(id: number, name: number, status: TableStatus) {
		this.id = id;
		this.name = name;
        this.status = status
	}

}