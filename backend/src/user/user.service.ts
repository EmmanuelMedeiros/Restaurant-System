import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { HashContract } from 'src/common/hashing/abstract-hash.entity';
import { AuthUserDTO } from './dto/auth.user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashService: HashContract
    ) {}

    async findAll(): Promise<User[]|null> {
        const userList: User[] = await this.userRepository.find();
        return userList;
    }

    async findOne(uuid: string): Promise<User|null> {
        const user: User|null = await this.userRepository.findOne({
            where: {
                uuid: uuid
            },
            select: {
                uuid: true,
                email: true,
                role: true
            }
        })
        return user;
    }

    async create(createUserDTO: CreateUserDTO): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {
            const hashPassword: string = await this.hashService.hash(createUserDTO.password);
            const newUser: User = new User(
                hashPassword,
                createUserDTO.uuid,
                createUserDTO.email,
                createUserDTO.role
            )
            await this.userRepository.insert(newUser);
            endMessage = {data: newUser, status: HttpStatus.CREATED};
        }catch(err) {
            endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
        return endMessage;
    }

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
            return endMessage = {data: fetchedUserByEmail, status: HttpStatus.OK};
        }catch(err) {
            return endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
    }
}
