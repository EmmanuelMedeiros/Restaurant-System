import { UserRole } from "@/enum/UserRole";
import { IUser } from "@/interface/IUser";

export default class CreateUserDTO implements Pick<IUser, "email"|"password"|"role">{
    public readonly password: string;
    public readonly role: UserRole;
    public readonly email: string;

    constructor(password: string, role: UserRole, email: string) {
        this.password = password,
        this.role = role,
        this.email = email
    }
}