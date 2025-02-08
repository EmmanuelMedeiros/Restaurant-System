import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/table/entity/table.entity';
import { Item } from './entity/item.entity';
import { ItemCategoryModule } from 'src/item-category/item-category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), ItemCategoryModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService]
})
export class ItemModule {}
