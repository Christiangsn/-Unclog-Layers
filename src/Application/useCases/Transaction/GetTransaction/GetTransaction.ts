import { TransactionRepository } from './../../../../Domain/Repository/TransactionRepository';
import pgp from 'pg-promise'

import { IGetTransaction, IOutputDTO } from "../../../Interfaces/Transaction";

export class GetTransaction implements IGetTransaction {
    constructor (
        readonly transactionRepository: TransactionRepository
    ) { }

    async execute (code: string): Promise<IOutputDTO> {
        const transaction = await this.transactionRepository.get(code)
        return transaction
    }

}