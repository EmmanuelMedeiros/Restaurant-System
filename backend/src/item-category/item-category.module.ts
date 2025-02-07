import { Module } from '@nestjs/common';
import { ItemCategoryService } from './item-category.service';
import { ItemCategoryController } from './item-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCategory } from './entity/item-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemCategory])],
  providers: [ItemCategoryService],
  controllers: [ItemCategoryController],
  exports: [ItemCategoryService]
})
export class ItemCategoryModule {}
