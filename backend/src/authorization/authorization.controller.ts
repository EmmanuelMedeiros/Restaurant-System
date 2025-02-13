import { Body, Controller, HttpException, HttpStatus, Inject, Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EndMessage } from "src/interface/EndMessage";
import { AuthUserDTO } from "src/user/dto/auth.user.dto";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { AuthorizationService } from "./authorization.service";

@Controller('auth')
export class AuthorizationController {
    constructor(
        private readonly authService: AuthorizationService
    ) {}


    @Post()
    async authenticate(@Body() authUser: AuthUserDTO) {
        const serviceResponse: EndMessage = await this.authService.authenticate(authUser);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }
}