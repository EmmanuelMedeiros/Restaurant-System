import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Request } from "express";
import { Observable } from "rxjs";
import jwtConfig from "../jwt/jwt.config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTGuard implements CanActivate {


    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService    
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request = context.switchToHttp().getRequest();
        const jwtToken: string|undefined = this.getBearerToken(request);
        if(!jwtToken) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        };
        
        try {
            const jwtPayload = await this.jwtService.verifyAsync(
                jwtToken,
                this.jwtConfiguration
            )

            request['user_email'] = jwtPayload.email;

            console.log(jwtPayload)
        } catch(err) {
            throw new HttpException(err.toString(), HttpStatus.UNAUTHORIZED);
        }

        return true

    }

    getBearerToken(request: Request):string|undefined {
        const jwtAuth: string|undefined = request.headers?.authorization;

        if(!jwtAuth) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        return jwtAuth.split(" ")[1];
    }


}