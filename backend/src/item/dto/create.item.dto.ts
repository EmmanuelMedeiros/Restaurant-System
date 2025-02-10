import { IItem } from "src/interface/IItem";
import { ItemCategory } from "src/item-category/entity/item-category.entity";

import * as moment from 'moment';

export class CreateItemDTO implements Pick<IItem, "category"|"createdAt"|"description"|"name"|"price"> {

    public readonly category: ItemCategory;

    private _createdAt: string;

    public readonly description?: string;

    public readonly name: string;
    
    public readonly price: number;

	constructor(category: ItemCategory, name: string, price: number, description?: string) {
		this.category = category;
		this._createdAt = moment().format('YYYY/MM/DD HH:mm:ss');
		this.description = description;
		this.name = name;
		this.price = price;
	}

    get createdAt(): string {
        return this._createdAt
    }

}