export interface ICreateTransaction {
    execute: ({ amount, code, numberInstallments, paymentMethod }: ICreateTransactionDTO) => Promise<void>
}

export interface ICreateTransactionDTO {
    code: string
    amount: number
    numberInstallments: number
    paymentMethod: string
}