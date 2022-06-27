import pgp from 'pg-promise'

import { ICreateTransaction, ICreateTransactionDTO } from "../../../Interfaces/Transaction";

export class CreateTransaction implements ICreateTransaction {
    constructor () { }

    async execute ({ amount, code, numberInstallments, paymentMethod }: ICreateTransactionDTO): Promise<void> {
        const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
        await connection.query('insert into transaction (code, amount, number_installments, payment_method) values ($1, $2, $3, $4)', [code, amount, numberInstallments, paymentMethod])
        
        let numbersTransaction = 1
        let amountTransaction = Math.round((amount / numberInstallments) * 100) / 100
        let diff =  Math.round((amount - amountTransaction * numberInstallments) * 100)  / 100

        while (numbersTransaction <= numberInstallments){

            if(numbersTransaction === numberInstallments)  {
                amountTransaction += diff
            }

            await connection.query('insert into installment (code, number, amount) values ($1, $2, $3)', [code, numbersTransaction, amountTransaction])
            numbersTransaction++
        }

        await connection.$pool.end()
    }

}