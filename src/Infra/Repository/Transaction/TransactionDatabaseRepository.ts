import pgp from 'pg-promise'

import { TransactionEntity } from "../../../Domain/Entity/TransactionEntity";
import { TransactionRepository } from "../../../Domain/Repository/TransactionRepository";

export class TransactionDatabaseRepository implements TransactionRepository {
    async save(transaction: TransactionEntity): Promise<void> {
        const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
        await connection.query('insert into transaction (code, amount, number_installments, payment_method) values ($1, $2, $3, $4)', 
            [transaction.code, transaction.amount, transaction.numberInstallments, transaction.paymentMethod])

        for (const installment of transaction.installments) {
            await connection.query('insert into installment (code, number, amount) values ($1, $2, $3)', [transaction.code, installment.number, installment.amount])
        }
        
        
        await connection.$pool.end()
    }

    async get(code: string): Promise<TransactionEntity> {
        
    }

}