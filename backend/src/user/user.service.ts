import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { EndMessage } from 'src/interface/EndMessage';
import { HashContract } from 'src/common/hashing/abstract-hash.entity';
import UpdateUserDTO from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashService: HashContract,
    ) {}

    async findAll(): Promise<User[]|null> {
        const userList: User[] = await this.userRepository.find({
            where: {
                deleted: false
            }
        });
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
        const allUsers = await this.userRepository.find()
        console.log(allUsers)
        return user;
    }

    async create(createUserDTO: CreateUserDTO): Promise<EndMessage> {
        let endMessage: EndMessage = {data: '', status: HttpStatus.OK}
        try {
            console.log("CAÍ AQUI")
            const hashPassword: string = await this.hashService.hash(createUserDTO.password);
            const newUser: User = new User(
                hashPassword,
                createUserDTO.uuid,
                createUserDTO.email,
                createUserDTO.role
            )

            const checkIfUserExists: User | null = await this.userRepository.findOneBy({
                email: createUserDTO.email,
            });
            if (!checkIfUserExists) {
                await this.userRepository.save(newUser);
            };
            await this.userRepository.update(checkIfUserExists!.uuid, {...createUserDTO, deleted: false});

            endMessage = {data: newUser, status: HttpStatus.CREATED};
        }catch(err) {
            endMessage = {data: err.toString(), status: HttpStatus.BAD_REQUEST};
        }
        return endMessage;
    }

    async update(updateUserDTO: UpdateUserDTO): Promise<User> {
        const checkIfUserExists: User | null = await this.userRepository.findOneBy({
            uuid: updateUserDTO.uuid,
        });
        if (!checkIfUserExists) {
            throw new Error("Esse usuário não existe!");
        };

        if (updateUserDTO.password) {
            const hashPassword: string = await this.hashService.hash(updateUserDTO.password);
            const userWithHashedPassowrd: UpdateUserDTO = new UpdateUserDTO(
                updateUserDTO.uuid,
                updateUserDTO.email,
                hashPassword
            );
            return await this.userRepository.save(userWithHashedPassowrd);
        }

        return await this.userRepository.save(updateUserDTO);
    }

    async delete(uuid: string): Promise<User> {
        const checkIfUserExists: User | null = await this.userRepository.findOneBy({
            uuid: uuid,
        });
        if (!checkIfUserExists) {
            throw new Error("Esse usuário não existe!");
        };
        await this.userRepository.update({uuid}, {deleted: true});
        return checkIfUserExists;
    }

}
