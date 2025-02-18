import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

import { EndMessage } from 'src/interface/EndMessage';
import { CreateUserDTO } from './dto/create.user.dto';
import { JWTGuard } from 'src/common/guard/jwt.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll(@Request() req) {
        const userList: User[]|null = await this.userService.findAll();
        if(!userList || userList.length < 1) {
            throw new HttpException("No user found", HttpStatus.NOT_FOUND);
        }
        return userList;
    } 

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO) {
        const createUser: CreateUserDTO = new CreateUserDTO(
            createUserDTO.email,
            createUserDTO.password,
            createUserDTO.role,
        )
        const serviceResponse: EndMessage = await this.userService.create(createUser);
        if(serviceResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }

    @HttpCode(HttpStatus.OK)
    @Get('/:uuid')
    async findOne(@Param('uuid') uuid: string) {
        const user: User|null = await this.userService.findOne(uuid)
        if(!user) {
            throw new HttpException("No user found for this UUID", HttpStatus.NOT_FOUND);
        }
        return user;
    }

}
