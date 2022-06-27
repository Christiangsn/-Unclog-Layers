import express, { Response, Request } from "express"
import pgp from 'pg-promise'

import { CreateTransaction } from "../../Application/useCases/Transaction/CreateTransaction/CreateTransaction"

const app = express()

app.use(express.json())

app.post('/transactions', async (req: Request, res: Response) => {
    const createTransaction = new CreateTransaction()
    await createTransaction.execute({
        amount: req.body.amount,
        code: req.body.code,
        numberInstallments: req.body.numberInstallments,
        paymentMethod: req.body.paymentMethod
    })
    res.end()
        
})

app.get('/transactions/:code', async (req: Request, res: Response) => { 
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    const transaction = await connection.one('SELECT * FROM transaction WHERE code = $1', [req.params.code])
    transaction.amount = parseFloat(transaction.amount)
    transaction.paymentMethod = transaction.payment_method

    const installments = await connection.query('SELECT * FROM installment WHERE code = $1', [req.params.code])

    for (const installment of installments) {
        installment.amount = parseFloat(installment.amount)
    }

    transaction.installments = installments

    await connection.$pool.end()

    res.json(transaction)
})

app.listen(3000)