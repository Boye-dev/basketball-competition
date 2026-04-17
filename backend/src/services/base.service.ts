import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";

class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async create(data: Partial<T>): Promise<T> {
    return this.model.create(data as T);
  }

  public async findAll(
    filter: FilterQuery<T> = {},
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  public async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  public async update(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  public async updateById(
    id: string,
    data: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  public async delete(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter).exec();
  }

  public async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}

export default BaseService;
