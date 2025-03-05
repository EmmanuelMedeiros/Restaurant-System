import { IItemCategory } from "@/interface/IItemCategory"

export class CreateItemDTO {
    public readonly name: string
    public readonly description?: string
    public readonly price: number
    public readonly category: IItemCategory

	constructor(name: string, price: number, category: IItemCategory, description?: string) {
        this.name = name,
        this.price = price,
        this.category = category,
        this.description = description
	}  
    
}