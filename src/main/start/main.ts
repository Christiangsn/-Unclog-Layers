import { GetTransaction } from './../../Application/useCases/Transaction/GetTransaction/GetTransaction';
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

    const getTransaction = new GetTransaction()
    const transaction = await getTransaction.execute(req.params.code)
    res.json(transaction)
})

app.listen(3000)