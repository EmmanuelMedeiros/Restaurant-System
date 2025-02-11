import { IsEmail, MaxLength, MinLength } from "class-validator";
import { User } from "../entity/user.entity";

export class AuthUserDTO implements Pick<User, "email"|"password"> {

    @IsEmail()
    public readonly email: string;

    @MinLength(7)
    @MaxLength(30)
    public readonly password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}

}