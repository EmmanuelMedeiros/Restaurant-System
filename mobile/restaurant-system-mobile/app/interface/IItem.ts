import { IItemCategory } from "./IItemCategory";

export interface IItem {
    id: number,
    name: string,
    description?: string,
    price: number,
    category: IItemCategory,
    createdAt: string,
    updatedAt?: string
}