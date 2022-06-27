import express, { Response, Request } from "express"
import pgp from 'pg-promise'

const app = express()

app.use(express.json())

app.post('/transactions', async (req: Request, res: Response) => {
    const connection = pgp()('postgres://postgres:123456@localhost:5432/app')
    await connection.query('insert into transaction (code, amount, number_installments, payment_method) values ($1, $2, $3, $4)', [req.body.code, req.body.amount, req.body.numberInstallments, req.body.paymentMethod])
    
    let numbersTransaction = 1
    let amountTransaction = Math.round((req.body.amount / req.body.numberInstallments) * 100) / 100
    let diff =  Math.round((req.body.amount - amountTransaction * req.body.numberInstallments) * 100)  / 100

    while (numbersTransaction <= req.body.numberInstallments){

        if(numbersTransaction === req.body.numberInstallments)  {
            amountTransaction += diff
        }

        await connection.query('insert into installment (code, number, amount) values ($1, $2, $3)', [req.body.code, numbersTransaction, amountTransaction])
        numbersTransaction++
    }

    await connection.$pool.end()

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