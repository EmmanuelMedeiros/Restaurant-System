import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { Role } from "src/enum/Role";

@Injectable()
export class UserRoleGuard implements CanActivate {

    private readonly userRole: Role

    constructor(userRole: Role) {
        this.userRole = userRole
    };

    async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request = context.switchToHttp().getRequest();
        try {
            const userRole: string|undefined = request.jwt_payload.role;
            switch(userRole) {
                case this.userRole:
                    return true;
                default: 
                    return false;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}