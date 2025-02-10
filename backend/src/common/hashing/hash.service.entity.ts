import { HashContract } from "./abstract-hash.entity";
import * as bcrypt from 'bcrypt'

export class HashService implements HashContract {
    async hash(password: string): Promise<string> {
        const saltRounds: number = 3;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    };

    async compare(hashPassword: string, password: string): Promise<boolean> {
        const validatePassword: boolean = await bcrypt.compare(password, hashPassword);
        return validatePassword;
    }
}