import { Repository, DeepPartial, FindOptionsWhere, FindOneOptions } from 'typeorm';
import { AppDataSource } from '../../config/database';

export class GenericRepository<T extends Object> {
    protected repository: Repository<T>;

    constructor(entity: any) {
        this.repository = AppDataSource.getRepository(entity);
    }

    async findAll(options?: any): Promise<T[]> {
        return this.repository.find(options);
    }

    async findById(id: any, options?: FindOneOptions<T>): Promise<T | null> {
        // @ts-ignore - TypeORM generic handling
        return this.repository.findOne({ where: { id }, ...options });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: any, data: DeepPartial<T>): Promise<T | null> {
        // @ts-ignore
        await this.repository.update(id, data);
        return this.findById(id);
    }

    async delete(id: any): Promise<void> {
        await this.repository.delete(id);
    }
}

