import express, { Request, Response } from 'express'
const app = express()

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello World' })
})

app.listen(3333, () => {
  console.log('Server started on port 3333!')
})
