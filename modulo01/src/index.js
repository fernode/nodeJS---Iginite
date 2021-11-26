const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()

const customers = []
app.use(express.json())

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

app.get('/statement/:cpf', (req, res) => {
  const { cpf } = req.params
  const customer = customers.find((customer) => customer.cpf === cpf)

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  return res.json(customer.statement)
})

app.listen(3333, () => {
  console.log('Server is running 🚀')
})
