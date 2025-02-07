import * as bcrypt from 'bcrypt';

export class PwdHash {

    static async generatePasswordHash(password: string) {
        const saltRounds: number = 3;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    static async validateHashPassword(password: string, hashPassword: string) {
        const validatePassword: boolean = await bcrypt.compare(password, hashPassword);
        validatePassword;
    }

}