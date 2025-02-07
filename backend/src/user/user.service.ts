import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { EndMessage } from 'src/interface/EndMessage';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]|null> {
        const userList: User[] = await this.userRepository.find();
        return userList;
    }

    async create(createUserDTO: CreateUserDTO): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {
            const newUser: User = new User(
                createUserDTO.password,
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
}
