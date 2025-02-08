import { TableStatus } from "src/enum/TableStatus"

export interface ITable {
    id: number,
    name: string
    status: TableStatus
}