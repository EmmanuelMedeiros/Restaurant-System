import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entity/item.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { CreateItemDTO } from './dto/create.item.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { UpdateItemDTO } from './dto/update.item.dto';

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

    async findAll() {
        const itemList: Item[]|null = await this.itemRepository.find();
        return itemList;
    }

    async findOne(id: number) {
    const item: Item|null = await this.itemRepository.findOne({
        where: {
          id: Number(id)
        },
        relations: {
            category: true
        }
      })
      return item;
    }

    async deleteOne(itemToDelete: Item) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        try {
            await this.itemRepository.delete(itemToDelete.id);
            return endMessage = {data: itemToDelete, status: HttpStatus.OK};
        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }

    async update(updateItemDTO: UpdateItemDTO, itemID: number): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        try {
            await this.itemRepository.update(itemID, updateItemDTO);
            const returnItem: Item|null = await this.itemRepository.findOne({where: {id: itemID}})
            return endMessage = {data: returnItem, status: HttpStatus.OK};
        }catch(err){
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }
}
