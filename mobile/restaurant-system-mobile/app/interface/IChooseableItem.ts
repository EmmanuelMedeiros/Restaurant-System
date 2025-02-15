import { IItemCategory } from "./IItemCategory";

export interface IChooseableItem {
    id: number,
    name: string,
    description?: string,
    price: number,
    category: IItemCategory,
    isChoosed: boolean,
    createdAt: string,
    updatedAt?: string,
}