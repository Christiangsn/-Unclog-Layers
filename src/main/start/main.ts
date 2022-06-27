import { GetTransaction } from './../../Application/useCases/Transaction/GetTransaction/GetTransaction';
import express, { Response, Request } from "express"
import pgp from 'pg-promise'

import { CreateTransaction } from "../../Application/useCases/Transaction/CreateTransaction/CreateTransaction"
import { TransactionDatabaseRepository } from '../../Infra/Repository/Transaction/TransactionDatabaseRepository';

const app = express()

app.use(express.json())

const transactionRepository = new TransactionDatabaseRepository()

app.post('/transactions', async (req: Request, res: Response) => {
    const createTransaction = new CreateTransaction(transactionRepository)
    await createTransaction.execute({
        amount: req.body.amount,
        code: req.body.code,
        numberInstallments: req.body.numberInstallments,
        paymentMethod: req.body.paymentMethod
    })
    res.end()
        
})

app.get('/transactions/:code', async (req: Request, res: Response) => { 

    const getTransaction = new GetTransaction(transactionRepository)
    const transaction = await getTransaction.execute(req.params.code)
    res.json(transaction)
})

app.listen(3000)