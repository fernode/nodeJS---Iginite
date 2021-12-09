import { v4 as uuidv4 } from 'uuid'

class Category {
  id?: String
  name: String
  description: String
  created_at: Date

  constructor(name: String, description: String) {
    if (!this.id) {
      this.id = uuidv4()
    }

    this.name = name
    this.description = description
    this.created_at = new Date()
  }
}

export { Category }
