import { Prisma } from '@prisma/client'

export class BaseRepository<T> {
  protected model: any

  constructor(model: any) {
    this.model = model
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany()
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    })
  }

  async create(data: Prisma.InputJsonValue): Promise<T> {
    return this.model.create({
      data,
    })
  }

  async update(id: number, data: Prisma.InputJsonValue): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    })
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({
      where: { id },
    })
  }
}