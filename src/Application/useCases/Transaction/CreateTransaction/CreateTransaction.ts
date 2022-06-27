import { TransactionEntity } from '../../../../Domain/Entity/TransactionEntity';
import { TransactionRepository } from '../../../../Domain/Repository/TransactionRepository';

import { ICreateTransaction, ICreateTransactionDTO } from "../../../Interfaces/Transaction";

export class CreateTransaction implements ICreateTransaction {
    constructor (
        readonly transactionRepository: TransactionRepository
    ) { }

    async execute ({ amount, code, numberInstallments, paymentMethod }: ICreateTransactionDTO): Promise<void> {
        const transaction = new TransactionEntity(code, amount, numberInstallments, paymentMethod)
        transaction.generateInstallments()
        await this.transactionRepository.save(transaction)

    }

}