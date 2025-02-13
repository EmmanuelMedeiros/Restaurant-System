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
                const jwtToken = await this.jwtService.signAsync(
                    {
                        uuid: fetchedUserByEmail[0].uuid,
                        email: fetchedUserByEmail[0].email
                    },
                    {
                        secret: this.jwtConfiguration.secret,
                        audience: this.jwtConfiguration.audience,
                        issuer: this.jwtConfiguration.issuer,
                        expiresIn: this.jwtConfiguration.jwtLifeTime
                    }
                )
                return endMessage = {data: jwtToken, status: HttpStatus.OK};
            }catch(err) {
                return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
            }
        }
}