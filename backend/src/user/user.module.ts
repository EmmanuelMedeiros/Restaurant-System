import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/common/jwt/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { HashContract } from 'src/common/hashing/abstract-hash.entity';
import { HashService } from 'src/common/hashing/hash.service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), AuthorizationModule
  ],
  controllers: [UserController],
  providers: [UserService,
    {
      provide: HashContract,
      useClass: HashService
    }
  ],
  exports: [UserService]
})
export class UserModule {}