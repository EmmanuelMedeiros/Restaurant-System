import { Role } from "src/enum/Role";

export interface IUser {
    uuid: string,
    email: string,
    role: Role,
    password: string
}