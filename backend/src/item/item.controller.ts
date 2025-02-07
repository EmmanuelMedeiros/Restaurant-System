import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { EndMessage } from 'src/interface/EndMessage';
import { CreateItemDTO } from './dto/create.item.dto';
import { ItemCategoryService } from 'src/item-category/item-category.service';
import { ItemCategory } from 'src/item-category/entity/item-category.entity';

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
}
