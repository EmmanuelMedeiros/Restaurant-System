import { ItemCategory } from "src/item-category/entity/item-category.entity";

import * as moment from 'moment';
import { Length, Min } from "class-validator";

export class UpdateItemDTO {

    public readonly category?: ItemCategory;

    public readonly description?: string;

    public readonly name?: string;

    public readonly price?: number;

    public readonly updatedAt: string 

	constructor(category?: ItemCategory, description?: string , name?: string, price?: number) {
		this.category = category;
		this.description = description;
		this.name = name;
		this.price = price;
        this.updatedAt = moment().format('YYYY/MM/DD HH:mm:ss');
	}
    
}