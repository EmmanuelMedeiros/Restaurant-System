import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ItemService } from './item.service';
import { EndMessage } from 'src/interface/EndMessage';
import { CreateItemDTO } from './dto/create.item.dto';
import { ItemCategoryService } from 'src/item-category/item-category.service';
import { ItemCategory } from 'src/item-category/entity/item-category.entity';
import { UpdateItemDTO } from './dto/update.item.dto';
import { Item } from './entity/item.entity';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';

@Controller('item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
        private readonly itemCategoryService: ItemCategoryService
    ) {};

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createItemDTO: CreateItemDTO) {

        const fetchedItemCategory: ItemCategory|null = await this.itemCategoryService.findOne(createItemDTO.category.id)
        if(!fetchedItemCategory) {
            throw new HttpException("No category for this ID", HttpStatus.NOT_FOUND);
        };
        const createItem: CreateItemDTO = new CreateItemDTO(
            fetchedItemCategory,
            createItemDTO.name,
            createItemDTO.price,
            createItemDTO.description
        )
        const serviceResponse: EndMessage = await this.itemService.create(createItem);
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }  

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll() {
        const itemList: Item[]|null = await this.itemService.findAll();
        if(!itemList || itemList.length < 1) {
            throw new HttpException("No item found in database", HttpStatus.BAD_REQUEST);
        }
        return itemList
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:id')
    async findOne(@Param('id') id: number) {
        const item: Item|null = await this.itemService.findOne(id);
        if(!item) {
            throw new HttpException("No item found for this ID", HttpStatus.NOT_FOUND);
        }
        return item;
    }

    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    async update(@Body() updateItemDTO: UpdateItemDTO, @Param('id') id: number) {
        const fetchedItem: Item|null = await this.itemService.findOne(id);
        if(!fetchedItem) {
            throw new HttpException("This item does not exist in database", HttpStatus.NOT_FOUND);
        };
        let fetchedItemCategory: ItemCategory|null = null;
        if(updateItemDTO.category) {
            fetchedItemCategory = await this.itemCategoryService.findOne(updateItemDTO.category?.id);
            if(!fetchedItemCategory) {
                throw new HttpException("This item category does not exist in database", HttpStatus.NOT_FOUND);
            };
        }
        const updateItem: UpdateItemDTO = new UpdateItemDTO(
            updateItemDTO.category,
            updateItemDTO.description,
            updateItemDTO.name,
            updateItemDTO.price
        )
        const serviceResponse: EndMessage = await this.itemService.update(updateItem, fetchedItem.id);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }

    @HttpCode(HttpStatus.OK)
    @Delete('/:id')
    async deleteOne(@Param('id') id: number) {
        const itemToDelete: Item|null = await this.itemService.findOne(id);
        if(!itemToDelete) {
            throw new HttpException("No item found for this ID", HttpStatus.NOT_FOUND);
        };
        const serviceResponse: EndMessage = await this.itemService.deleteOne(itemToDelete);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, serviceResponse.status);
        }
        return serviceResponse;
    }
}
