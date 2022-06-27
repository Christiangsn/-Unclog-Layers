import ConnectionDatabase from '../../Connection/Connection';

import { InstallmentsEntity } from '../../../Domain/Entity/InstalmentsEntity';
import { TransactionEntity } from "../../../Domain/Entity/TransactionEntity";

import { TransactionRepository } from "../../../Domain/Repository/TransactionRepository";


export class TransactionDatabaseRepository implements TransactionRepository {
    constructor (
        readonly connection: ConnectionDatabase
    ){ }

    async save(transaction: TransactionEntity): Promise<void> {
        
        await this.connection.query('insert into transaction (code, amount, number_installments, payment_method) values ($1, $2, $3, $4)', 
            [transaction.code, transaction.amount, transaction.numberInstallments, transaction.paymentMethod])

        for (const installment of transaction.installments) {
            await this.connection.query('insert into installment (code, number, amount) values ($1, $2, $3)', [transaction.code, installment.number, installment.amount])
        }
    }

    async get(code: string): Promise<TransactionEntity> {
        
        const transactionDB = await this.connection.one('SELECT * FROM transaction WHERE code = $1', [code])

        const transaction = new TransactionEntity(transactionDB.code, parseFloat(transactionDB.amount), transactionDB.number_installments, transactionDB.payment_method)    
        const installmentsDB = await this.connection.query('SELECT * FROM installment WHERE code = $1', [code])
    
        for (const installmentDB of installmentsDB) {
            const installment = new InstallmentsEntity(installmentDB.number, parseFloat(installmentDB.amount))
            transaction.installments.push(installment)
        }
        
        return transaction
    }

}