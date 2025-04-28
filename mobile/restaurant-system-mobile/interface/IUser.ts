import { UserRole } from '../enum/UserRole'

export interface IUser {
    uuid: string,
    email: string,
    role: UserRole,
    password: string
}