import { UserRole } from '../enum/UserRole'

export interface IUser {
    uuid: string,
    userName: string,
    role: UserRole,
    password: string
}