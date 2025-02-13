import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HashContract } from "src/common/hashing/abstract-hash.entity";
import { HashService } from "src/common/hashing/hash.service.entity";
import jwtConfig from "src/common/jwt/jwt.config";
import { UserModule } from "src/user/user.module";
import { AuthorizationController } from "./authorization.controller";
import { AuthorizationService } from "./authorization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig), 
        TypeOrmModule.forFeature([User])],
        providers: [AuthorizationService,
            {
                provide: HashContract,
                useClass: HashService
            }
            ],
    controllers: [AuthorizationController],
    exports: [HashContract, JwtModule, ConfigModule]
})
export class AuthorizationModule{}