import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCategory } from './entity/item-category.entity';
import { InsertResult, Repository } from 'typeorm';
import { CreateItemCategoryDTO } from './dto/create.itemCategory.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { UpdateItemCategoryDTO } from './dto/update.itemCategory.dto';

@Injectable()
export class ItemCategoryService {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly itemCategoryRepository: Repository<ItemCategory>,
  ) {}

  async create(createItemCategoryDTO: CreateItemCategoryDTO): Promise<EndMessage> {
    let endMessage: EndMessage = { data: '', status: HttpStatus.CREATED };
    try {
      const itemCategoryToInsert: ItemCategory = new ItemCategory(0, createItemCategoryDTO.title);

      const checkIfItemCategoryAlreadyExists = await this.itemCategoryRepository.find({
        where: {
            title: createItemCategoryDTO.title,
        }
      });

      if (checkIfItemCategoryAlreadyExists.length > 0) {
        await this.itemCategoryRepository.update({title: createItemCategoryDTO.title}, {deleted: false});
        return (endMessage = {data: 'Categoria criada', status: 200});
      }

      const itemCategory: InsertResult = await this.itemCategoryRepository.insert(itemCategoryToInsert);
      const insertedTable: ItemCategory = new ItemCategory(
        itemCategory.raw[0].id,
        createItemCategoryDTO.title,
      );
      return (endMessage = { data: insertedTable, status: HttpStatus.CREATED });
    } catch (err) {
      return (endMessage = {
        data: err.toString(),
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findOne(id: number): Promise<ItemCategory | null> {
    const book: ItemCategory | null = await this.itemCategoryRepository.findOne({
      where: {
        id: id,
      },
    });
    return book;
  }

  async update(
    updateItemCategoryDTO: UpdateItemCategoryDTO,
    itemCategoryID: number,
  ): Promise<EndMessage> {
    let endMessage: EndMessage = { data: '', status: HttpStatus.OK };
    try {
      await this.itemCategoryRepository.update(itemCategoryID, updateItemCategoryDTO);
      const itemCategory: ItemCategory = {
        id: itemCategoryID,
        title: updateItemCategoryDTO.title,
      };
      return (endMessage = { data: itemCategory, status: HttpStatus.OK });
    } catch (err) {
      return (endMessage = {
        data: err.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(): Promise<ItemCategory[] | null> {
    const itemCategoriesList: ItemCategory[] = await this.itemCategoryRepository.find({
      where: { deleted: false },
    });
    return itemCategoriesList;
  }

  async deleteOne(itemCategory: ItemCategory): Promise<EndMessage> {
    let endMessage: EndMessage = { data: '', status: HttpStatus.CREATED };
    try {
      await this.itemCategoryRepository.update(itemCategory, { deleted: true });
      return (endMessage = { data: itemCategory, status: HttpStatus.OK });
    } catch (err) {
      return (endMessage = {
        data: err.toString(),
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
