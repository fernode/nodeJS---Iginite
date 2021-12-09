import { Router } from 'express'
import { v4 as uuid } from 'uuid'

const categoriesRouter = Router()

const categories = []
categoriesRouter.post('/', (request, response) => {
  const { name, description } = request.body

  const category = {
    id: uuid(),
    name,
    description,
    created_at: new Date(),
  }

  categories.push(category)

  return response.status(201).send()
})

export { categoriesRouter }
