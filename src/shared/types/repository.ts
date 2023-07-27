export interface IRepository<T> {
  create(entity: Partial<T>): Promise<T>;
  update(id: string | number, entity: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
  findById(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
}
