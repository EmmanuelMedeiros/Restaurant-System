import { Global, Module } from "@nestjs/common";
import { HashContract } from "../hashing/abstract-hash.entity";
import { HashService } from "../hashing/hash.service.entity";

@Global()
@Module({
    providers: [{
        provide: HashContract,
        useClass: HashService
    }],
    exports: [HashContract]
})
export class AuthModule{}