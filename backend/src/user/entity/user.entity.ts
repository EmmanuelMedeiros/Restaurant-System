import { Role } from "src/enum/Role";
import { IUser } from "src/interface/IUser";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User implements IUser {

    @PrimaryColumn()
    public readonly uuid: string;

    @Column({name: 'email', unique: true, type: "varchar", length: "100"})
    email: string;

    @Column({name: "role", enum: Role})
    role: Role;

    @Column({type: 'text', nullable: false})
    password: string;


	constructor(password: string, uuid: string, email: string, role: Role) {
		this.password = password;
		this.uuid = uuid;
        this.email = email,
        this.role = role
	}
    
    
}