import { IsString, Length } from "class-validator";
import { IItemCategory } from "src/interface/IItemCategory";

export class CreateItemCategoryDTO implements Pick<IItemCategory, "title"> {
	
	@IsString()
	@Length(1, 50)
    private _title: string;

	constructor(title: string) {
		this._title = title;
	}

	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

}