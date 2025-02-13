import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import jwtConfig from "../jwt/jwt.config";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTVerify implements NestMiddleware {
    constructor(
            @Inject(jwtConfig.KEY)
            private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
            private readonly jwtService: JwtService    
        ) {}

    async use(req: Request, res: Response, next: (error?: any) => void) {

        const authorization: string|undefined = req.headers?.authorization;
        const verifiedToken: string|undefined = this.verifyToken(authorization);

        if(!verifiedToken) {
            return next();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                verifiedToken,
                this.jwtConfiguration
            );
            req["jwt_payload"] = payload;
        } catch(err) {
            console.log(err)
        }

        next()
    }

    verifyToken(authorization: string|undefined) {
        if(!authorization) {
            return undefined
        };
        return authorization.split(" ")[1];
    }

}