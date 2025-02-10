import { Global, Module } from "@nestjs/common";
import { HashContract } from "./abstract-hash.entity";
import { HashService } from "./hash.service.entity";

@Global()
@Module({
    providers: [{
        provide: HashContract,
        useClass: HashService
    }],
    exports: [HashContract]
})
export class HashModule {

}