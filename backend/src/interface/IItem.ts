import { ItemCategory } from "src/item-category/entity/item-category.entity";

export interface IItem {
    id: number,
    name: string,
    description?: string,
    price: number,
    category: ItemCategory,
    createdAt: string,
    updatedAt?: string
}