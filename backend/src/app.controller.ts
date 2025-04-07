import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { Role } from './enum/Role';
import { CreateUserDTO } from './user/dto/create.user.dto';
import { ItemCategory } from './item-category/entity/item-category.entity';
import { CreateItemCategoryDTO } from './item-category/dto/create.itemCategory.dto';
import { ItemCategoryService } from './item-category/item-category.service';
import { User } from './user/entity/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly itemCategoryService: ItemCategoryService
  ) {}

  async setDatabase() {

    const hasUser: User[]|null = await this.userService.findAll();

    if(hasUser === null) {
      return;
    }

    const firstUser: CreateUserDTO = new CreateUserDTO(
      "admin@email.com",
      "adminadmin",
      Role.ADMIN
    );
    await this.userService.create(firstUser);

    const categoryTitle: string[] = ["Almoço", "Tira-gosto", "Bebida"];
    const commonCategories: CreateItemCategoryDTO[] = [];

    categoryTitle.forEach((element) => {
      commonCategories.push(
        new CreateItemCategoryDTO(element)
      );
    });

    await commonCategories.forEach((element) => {
      this.itemCategoryService.create(element);
    })

  }

}
