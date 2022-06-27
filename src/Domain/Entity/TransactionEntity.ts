import { InstallmentsEntity } from "./InstalmentsEntity"

export class TransactionEntity {
    installments: InstallmentsEntity[]

    constructor(
        readonly code: string,
        readonly amount: number,
        readonly numberInstallments: number,
        readonly paymentMethod: string
    ) {
        this.installments = []
    }

    generateInstallments () {
        let numbersTransaction = 1
        let amountTransaction = Math.round((this.amount / this.numberInstallments) * 100) / 100
        let diff =  Math.round((this.amount - amountTransaction * this.numberInstallments) * 100)  / 100
        while (numbersTransaction <= this.numberInstallments){

            if(numbersTransaction === this.numberInstallments)  {
                amountTransaction += diff
            }

            this.installments.push(new InstallmentsEntity(numbersTransaction, amountTransaction))
            
            numbersTransaction++
        }
    }
}