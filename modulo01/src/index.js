const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()

const customers = []
app.use(express.json())

function checkAccountExistsByCpf(req, res, next) {
  const { cpf } = req.headers
  const customer = customers.find((customer) => customer.cpf === cpf)

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  req.customer = customer
  return next()
}

function getBalance(statement) {
  const balance = statement.reduce((acc, statement) => {
    if (statement.type === 'credit') {
      return acc + statement.amount
    } else {
      return acc - statement.amount
    }
  }, 0)

  return balance
}

app.post('/account', (req, res) => {
  const { cpf, name } = req.body

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  )
  if (customerAlreadyExists) {
    return res.status(400).json({ error: 'Customer already exists' })
  }

  customers.push({ id: uuidv4(), cpf, name, statement: [] })
  return res.status(201).send()
})

app.get('/statement', checkAccountExistsByCpf, (req, res) => {
  const { customer } = req
  return res.json(customer.statement)
})

app.post('/deposit', checkAccountExistsByCpf, (req, res) => {
  const { description, amount } = req.body
  const { customer } = req

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  }

  customer.statement.push(statementOperation)
  return res.status(201).send()
})

app.listen(3333, () => {
  console.log('Server is running 🚀')
})

app.post('/withdraw', checkAccountExistsByCpf, (req, res) => {
  const { amount } = req.body
  const { customer } = req

  const balance = getBalance(customer.statement)
  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds!' })
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  }

  customer.statement.push(statementOperation)
  return res.status(201).send()
})

app.get('/statement/date', checkAccountExistsByCpf, (req, res) => {
  const { date } = req.query
  const { customer } = req

  const dateFormat = new Date(date + ' 00:00')
  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() === dateFormat.toDateString()
  )

  return res.json(statement)
})

app.put('/account', checkAccountExistsByCpf, (req, res) => {
  const { name } = req.body
  const { customer } = req

  customer.name = name
  return res.status(201).send()
})

app.get('/account', checkAccountExistsByCpf, (req, res) => {
  const { customer } = req
  return res.json(customer)
})

app.delete('/account', checkAccountExistsByCpf, (req, res) => {
  const { customer } = req

  const customerIndex = customers.findIndex(
    (customer) => customer.id === customer.id
  )
  customers.splice(customerIndex, 1)
  return res.status(200).json(customers)
})
