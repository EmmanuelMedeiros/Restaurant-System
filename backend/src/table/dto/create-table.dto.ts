import { IsEmpty, IsString, Length } from "class-validator";
import { ITable } from "src/interface/ITable";
import { IsNull } from "typeorm";

export class CreateTableDTO implements Pick<ITable, "name"> {
    
	@IsString()
	@Length(1, 10)
    private _name: string;

	constructor(name: string) {
		this._name = name;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

}