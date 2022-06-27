export interface IGetTransaction {
    execute: (code: string) => Promise<IOutputDTO>
}

export interface IOutputDTO {
    code: string
    amount: number
    numberInstallments: number
    paymentMethod: string
    installments: {
        number: number
        amount: number
    }[]
}