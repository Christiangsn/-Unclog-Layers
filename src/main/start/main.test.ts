import axios from 'axios'
import { CreateTransaction } from '../../Application/useCases/Transaction/CreateTransaction/CreateTransaction'
import { GetTransaction } from '../../Application/useCases/Transaction/GetTransaction/GetTransaction'

test('Should create one transaction', async () => {
    const code = `${Math.floor(Math.random() * 2000)}`
    const request = {
        code,
        amount: 1000,
        numberInstallments: 12,
        paymentMethod: 'credit_card'
    }
    const createTransaction = new CreateTransaction()
    await createTransaction.execute(request)


    const getTransaction = new GetTransaction()
    const transaction = await getTransaction.execute(code)
    expect(transaction.code).toBe(code)
    expect(transaction.amount).toBe(1000)
    expect(transaction.paymentMethod).toBe("credit_card")
    expect(transaction.installments).toHaveLength(12)
    expect(transaction.installments[0].amount).toBe(83.33)
    expect(transaction.installments[11].amount).toBe(83.37)

})