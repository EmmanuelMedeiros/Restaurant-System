import { IsEmpty, IsEnum, isEnum, IsString, Length } from "class-validator";
import { TableStatus } from "src/enum/TableStatus";
import { ITable } from "src/interface/ITable";
import { IsNull } from "typeorm";

export class CreateTableDTO implements Pick<ITable, "name"|"status"> {
    
	@IsString()
	@Length(1, 10)
    private _name: number;

	@IsEnum(TableStatus)
	private _status: TableStatus

	constructor(name: number, status: TableStatus) {
		this._name = name;
		this._status = status;
	}

	public get name(): number {
		return this._name;
	}

	public set name(value: number) {
		this._name = value;
	}

	public get status(): TableStatus {
		return this._status;
	}

	public set status(status: TableStatus) {
		this.status = status;
	}


}