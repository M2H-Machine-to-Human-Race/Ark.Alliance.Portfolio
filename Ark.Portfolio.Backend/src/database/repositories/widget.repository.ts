import { GenericRepository } from './generic.repository';
import { Widget } from '../entities/widget.entity';

export class WidgetRepository extends GenericRepository<Widget> {
    constructor() {
        super(Widget);
    }

    async findByContext(context: string): Promise<Widget[]> {
        return this.repository.find({
            where: { context },
            order: { order: 'ASC' }
        });
    }
}

