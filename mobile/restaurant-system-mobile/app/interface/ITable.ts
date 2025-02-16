import { TableStatus } from "../enum/TableStatus";

export interface ITable {
    id: number,
    name: string,
    status: TableStatus
}