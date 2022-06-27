import pgp from 'pg-promise'
import { InstallmentsEntity } from '../../../Domain/Entity/InstalmentsEntity';

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
        const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
        const transactionDB = await connection.one('SELECT * FROM transaction WHERE code = $1', [code])

        const transaction = new TransactionEntity(transactionDB.code, parseFloat(transactionDB.amount), transactionDB.number_installments, transactionDB.payment_method)    
        const installmentsDB = await connection.query('SELECT * FROM installment WHERE code = $1', [code])
    
        for (const installmentDB of installmentsDB) {
            const installment = new InstallmentsEntity(installmentDB.number, parseFloat(installmentDB.amount))
            transaction.installments.push(installment)
        }
        
        await connection.$pool.end()
        return transaction
    }

}