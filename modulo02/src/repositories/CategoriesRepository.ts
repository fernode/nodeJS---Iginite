import { Category } from '../model/Category'

interface ICreateCategoryDTO {
  name: string
  description: string
}

class CategoriesRepository {
  private categories: Category[]

  constructor() {
    this.categories = []
  }

  create({ name, description }: ICreateCategoryDTO): void {
    const category = new Category(name, description)

    this.categories.push(category)
  }

  all(): Category[] {
    return this.categories
  }

  findByName(name: string): Category | undefined {
    const category = this.categories.find((category) => category.name === name)
    return category
  }
}

export { CategoriesRepository }
