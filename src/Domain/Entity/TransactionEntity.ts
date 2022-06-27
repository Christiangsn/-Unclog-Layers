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
}