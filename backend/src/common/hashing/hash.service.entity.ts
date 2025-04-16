import { HashContract } from "./abstract-hash.entity";
import {compare, genSalt, hash} from 'bcryptjs'

export class HashService implements HashContract {
    async hash(password: string): Promise<string> {
        const saltRounds: number = 3;
        const salt = await genSalt(saltRounds);
        const hashed = await hash(password, salt);
        return hashed;
    };

    async compare(hashPassword: string, password: string): Promise<boolean> {
        const validatePassword: boolean = await compare(password, hashPassword);
        return validatePassword;
    }
}