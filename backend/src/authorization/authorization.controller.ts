import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Injectable, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EndMessage } from "src/interface/EndMessage";
import { AuthUserDTO } from "src/user/dto/auth.user.dto";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { AuthorizationService } from "./authorization.service";
import { RefreshTokenDTO } from "./dto/refreshToken.dto";

@Controller('auth')
export class AuthorizationController {
    constructor(
        private readonly authService: AuthorizationService
    ) {}


    @HttpCode(HttpStatus.OK)
    @Post()
    async authenticate(@Body() authUser: AuthUserDTO) {
        console.log(authUser)
        const serviceResponse: EndMessage = await this.authService.authenticate(authUser);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }

    @Post("/refresh")
    async refreshToken(@Body() refreshToken: RefreshTokenDTO) {
        const serviceResponse: EndMessage = await this.authService.jwtRefresh(refreshToken);
        if(serviceResponse.status !== HttpStatus.OK) {
            throw new HttpException(serviceResponse.data, HttpStatus.BAD_REQUEST);
        }
        return serviceResponse;
    }


    @Post("/verify")
    async verifyToken(@Body() jwtToken: {jwtToken: string}) {
        const serviceResponse: EndMessage = await this.authService.verifyTokenValidation(jwtToken);
        return serviceResponse;
    }
}