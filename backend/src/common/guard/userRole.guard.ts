import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { Role } from "src/enum/Role";

@Injectable()
export class UserRoleGuard implements CanActivate {

    private readonly acceptedRoles: Role[]

    constructor(acceptedRoles: Role[]) {
        this.acceptedRoles = acceptedRoles
    };

    async canActivate(context: ExecutionContext): Promise<boolean>{
        
        const request = context.switchToHttp().getRequest();
        try {
            const userRole: string|undefined = request.jwt_payload.role;

            if(this.acceptedRoles.find(x => x === userRole)) {
                return true;
            };
            return false;
        } catch(err) {
            console.log("Could not get user role");
            return false;
        }
    }
}