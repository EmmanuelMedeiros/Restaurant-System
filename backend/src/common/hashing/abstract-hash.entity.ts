export abstract class HashContract {
    abstract hash(password: string):Promise<string>;
    abstract compare(hashPassword: string, password: string):Promise<boolean>;
}