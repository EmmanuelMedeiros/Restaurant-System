import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { CreateItemCategoryDTO } from './dto/create.itemCategory.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { ItemCategory } from './entity/item-category.entity';
import { UpdateItemCategoryDTO } from './dto/update.itemCategory.dto';
import { Item } from 'src/item/entity/item.entity';

@Controller('item-category')
export class ItemCategoryController {
    constructor(private readonly itemCategoryService: ItemCategoryService) {};

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createItemCategoryDTO: CreateItemCategoryDTO) {
        const serviceResponse: EndMessage = await this.itemCategoryService.create(createItemCategoryDTO);
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }  

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll() {
        const itemCategoriesList: ItemCategory[]|null = await this.itemCategoryService.findAll();
        if(!itemCategoriesList || itemCategoriesList.length < 1) {
            throw new HttpException("No categories found", HttpStatus.NOT_FOUND);
        }
        return itemCategoriesList;
    }

    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async update(@Body() updateItemCategory: UpdateItemCategoryDTO, @Param('id') id: number) {
        const fetchedItemCategory: ItemCategory|null = await this.itemCategoryService.findOne(id);
        if(!fetchedItemCategory) {
            throw new HttpException("There is not an item category for this ID", HttpStatus.BAD_REQUEST);
        };
        const updatedUser: EndMessage = await this.itemCategoryService.update(updateItemCategory, id);
        if(updatedUser.status !== HttpStatus.OK) {
            throw new HttpException(updatedUser.data, updatedUser.status);
        }
        return updatedUser;
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async find(@Param('id') id:number) {
        const item: ItemCategory|null = await this.itemCategoryService.findOne(id);
        if(!item) {
            throw new HttpException("No item category found for this ID", HttpStatus.NOT_FOUND);
        };
        return item
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deleteOne(@Param('id') id:number) {
        const itemCategory: ItemCategory|null = await this.itemCategoryService.findOne(id);
        if(!itemCategory) {
            throw new HttpException("No item category found for this ID", HttpStatus.NOT_FOUND);
        };
        const serviceResponse: EndMessage = await this.itemCategoryService.deleteOne(itemCategory);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }
}
