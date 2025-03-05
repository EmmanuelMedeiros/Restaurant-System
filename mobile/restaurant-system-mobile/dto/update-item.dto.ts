import { IItemCategory } from "@/interface/IItemCategory"

export class UpdateItemDTO {
    public readonly id: number
    public readonly name?: string
    public readonly description?: string
    public readonly price?: number
    public readonly category?: IItemCategory

    constructor(id: number, name?: string, price?: number, category?: IItemCategory, description?: string) {
        this.id = id,
        this.name = name,
        this.price = price,
        this.category = category,
        this.description = description
    }  
    
}