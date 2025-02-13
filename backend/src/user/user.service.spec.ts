import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./entity/user.entity";
import { HashContract } from "src/common/hashing/abstract-hash.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Role } from "src/enum/Role";
import { CreateUserDTO } from "./dto/create.user.dto";
import { EndMessage } from "src/interface/EndMessage";
import { HttpStatus } from "@nestjs/common";

describe('userService', () => {

    let userService: UserService;
    let userRepository: Repository<User>;
    let hashService: HashContract


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService,
                    {
                        provide: getRepositoryToken(User),
                        useValue: {
                            insert: jest.fn()
                        }
                    },
                    {
                        provide: HashContract,
                        useValue: {
                            hash: jest.fn()
                        }
                    }
                ]
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        hashService = module.get<HashContract>(HashContract);

    });

    describe('create', () => {
        it("Must create a new user", async () => {

            const createUserDTO = new CreateUserDTO(
                "email@email",
                "1234",
                Role.ADMIN
            )

            jest.spyOn(hashService, 'hash').mockResolvedValue('pwdHash')
            const endMessage: EndMessage = await userService.create(createUserDTO)

            const newUser: User = new User(
                "pwdHash",
                createUserDTO.uuid,
                createUserDTO.email,
                createUserDTO.role
            )

            expect(hashService.hash).toHaveBeenCalledWith(createUserDTO.password);
            expect(userRepository.insert).toHaveBeenCalledWith(newUser)
            expect(endMessage).toStrictEqual(
                {data: newUser, status: HttpStatus.CREATED}
            )

        })
    })

});
