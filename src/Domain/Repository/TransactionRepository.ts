import { TransactionEntity } from "../Entity/TransactionEntity"

export interface TransactionRepository {
    save (transaction: TransactionEntity): Promise<void>
    get (code: string): Promise<TransactionEntity>
}