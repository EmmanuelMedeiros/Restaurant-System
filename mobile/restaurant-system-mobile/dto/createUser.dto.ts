import { UserRole } from "@/enum/UserRole";
import { IUser } from "@/interface/IUser";

export default class CreateUserDTO implements Pick<IUser, "userName"|"password"|"role">{
    public readonly password: string;
    public readonly role: UserRole;
    public readonly userName: string;

    constructor(password: string, role: UserRole, userName: string) {
        this.password = password,
        this.role = role,
        this.userName = userName
    }
}