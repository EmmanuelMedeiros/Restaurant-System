import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { CreateItemCategoryDTO } from './dto/create.itemCategory.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { ItemCategory } from './entity/item-category.entity';

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
