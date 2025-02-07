import { HttpStatus } from "@nestjs/common";

export interface EndMessage {
    data: any,
    status: HttpStatus
}