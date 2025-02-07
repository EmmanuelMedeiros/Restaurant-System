import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { InsertResult, Repository } from 'typeorm';
import { CreateItemDTO } from './dto/create.item.dto';
import { EndMessage } from 'src/interface/EndMessage';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ) {};

    async create(createItemDTO: CreateItemDTO): Promise<EndMessage>{
            let endMessage: EndMessage = {data: '', status: HttpStatus.CREATED};
            try {
                const itemCategoryToInsert: Item = new Item(
                    createItemDTO.category,
                    0,
                    createItemDTO.name,
                    createItemDTO.price,
                    createItemDTO.createdAt,
                    undefined,
                    createItemDTO.description
                )
                const itemCategory: InsertResult = await this.itemRepository.insert(itemCategoryToInsert);
                const insertedTable: Item = {
                    ...itemCategoryToInsert,
                    id: itemCategory.raw[0].id
                }
                return endMessage = {data: insertedTable, status: HttpStatus.CREATED};
            }catch(err){
                return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
            }
        }
}
