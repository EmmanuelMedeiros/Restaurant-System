import { Body, HttpStatus, Inject, Injectable, Post } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { HashContract } from "src/common/hashing/abstract-hash.entity";
import jwtConfig from "src/common/jwt/jwt.config";
import { EndMessage } from "src/interface/EndMessage";
import { AuthUserDTO } from "src/user/dto/auth.user.dto";
import { User } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { RefreshTokenDTO } from "./dto/refreshToken.dto";

@Injectable()
export class AuthorizationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashService: HashContract,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) {}

    async authenticate(authUserDTO: AuthUserDTO): Promise<EndMessage> {
            let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
            try {
                const fetchedUserByEmail: User[] = await this.userRepository.findBy({email: authUserDTO.email});
                if(fetchedUserByEmail.length === 0) {
                    return endMessage = {data: 'Credentials not found in system', status: HttpStatus.BAD_REQUEST};
                }
                if( !(await this.hashService.compare(fetchedUserByEmail[0].password, authUserDTO.password)) ) {
                    return endMessage = {data: 'Credentials not match', status: HttpStatus.BAD_REQUEST};
                };

                const jwtPayload: Pick<User, "email"|"role"> = {
                    email: fetchedUserByEmail[0].email,
                    role: fetchedUserByEmail[0].role,
                }

                const jwtToken = await this.signJwtToken(fetchedUserByEmail[0].uuid, this.jwtConfiguration.jwtLifeTime, jwtPayload);
                const refreshToken = await this.signJwtToken(fetchedUserByEmail[0].uuid, this.jwtConfiguration.refreshJwtLifeTime);

                return endMessage = {data: {jwtToken, refreshToken}, status: HttpStatus.OK};
            }catch(err) {
                return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
            }
        }

    async signJwtToken(sub: string, expiresIn: number, payload?: object) {
        return await this.jwtService.signAsync(
            {
                sub: sub,
                ...payload
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: expiresIn
            }
        )
    }

    async jwtRefresh(refreshToken: RefreshTokenDTO) {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK};
        try {

            const { sub } = await this.jwtService.verifyAsync(
                refreshToken.refreshToken,
                this.jwtConfiguration
            );

            const fetchUser: User|null = await this.userRepository.findOne(
                {
                    where: {
                        uuid: sub 
                    }
                }
            )
            if(!fetchUser) {
                return endMessage = {data: 'User not found for this JWT TOKEN', status: HttpStatus.BAD_REQUEST};
            }
            const jwtPayload: Pick<User, "email"|"role"> = {
                email: fetchUser.email,
                role: fetchUser.role,
            }

            const newJWTToken: string = await this.signJwtToken(fetchUser.uuid, this.jwtConfiguration.jwtLifeTime, jwtPayload);
            return endMessage = {data: {newJWTToken, refreshToken}, status: HttpStatus.OK};

        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.UNAUTHORIZED};
        }
    }
}