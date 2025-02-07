import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCategory } from './entity/item-category.entity';
import { InsertResult, Repository } from 'typeorm';
import { CreateItemCategoryDTO } from './dto/create.itemCategory.dto';
import { EndMessage } from 'src/interface/EndMessage';

@Injectable()
export class ItemCategoryService {
    constructor(
        @InjectRepository(ItemCategory)
        private readonly itemCategoryRepository: Repository<ItemCategory>
    ) {};

    async create(createItemCategoryDTO: CreateItemCategoryDTO): Promise<EndMessage>{
        let endMessage: EndMessage = {data: '', status: HttpStatus.CREATED};
        try {
            const itemCategoryToInsert: ItemCategory = new ItemCategory(
                0,
                createItemCategoryDTO.title
            )
            const itemCategory: InsertResult = await this.itemCategoryRepository.insert(itemCategoryToInsert);
            const insertedTable: ItemCategory = new ItemCategory(
                itemCategory.raw[0].id,
                createItemCategoryDTO.title
            )
            return endMessage = {data: insertedTable, status: HttpStatus.CREATED};
        }catch(err){
            return endMessage = {data: err.toString(), status: HttpStatus.INTERNAL_SERVER_ERROR};
        }
    }

    async findOne(id: number): Promise<ItemCategory|null> {
        const book: ItemCategory|null = await this.itemCategoryRepository.findOne({
          where: {
            id: id
          }
        })
        return book;
      }
}
