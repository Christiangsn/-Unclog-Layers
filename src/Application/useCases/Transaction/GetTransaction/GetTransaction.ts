import pgp from 'pg-promise'

import { IGetTransaction, IOutputDTO } from "../../../Interfaces/Transaction";

export class GetTransaction implements IGetTransaction {
    constructor () { }

    async execute (code: string): Promise<IOutputDTO> {
        const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
        const transaction = await connection.one('SELECT * FROM transaction WHERE code = $1', [code])
        transaction.amount = parseFloat(transaction.amount)
        transaction.paymentMethod = transaction.payment_method
    
        const installments = await connection.query('SELECT * FROM installment WHERE code = $1', [code])
    
        for (const installment of installments) {
            installment.amount = parseFloat(installment.amount)
        }
    
        transaction.installments = installments
    
        await connection.$pool.end()

        return transaction
    }

}