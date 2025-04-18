import { IsEmail, IsEmpty, IsEnum, Length } from "class-validator";
import { Role } from "src/enum/Role";
import { IUser } from "src/interface/IUser";

const crypto = require('crypto');

export class CreateUserDTO implements Pick<IUser, "email"|"password"|"role"> {

    @IsEmail()
    public readonly email: string;

    @Length(7, 30)
    public readonly password: string;

    @IsEnum(Role)
    public readonly role: Role;

    public readonly uuid: string;

	constructor(email: string, password: string, role: Role) {
		this.email = email;
		this.password = password;
		this.role = role;
        this.uuid = crypto.randomUUID()
	}

}