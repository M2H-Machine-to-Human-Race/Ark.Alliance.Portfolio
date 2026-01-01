import { AppDataSource } from '../config/database';
import { Outbox } from '../database/entities/outbox.entity';

export class EventService {
    private outboxRepo = AppDataSource.getRepository(Outbox);

    async publish(type: string, payload: any): Promise<void> {
        const event = this.outboxRepo.create({
            type,
            payload,
            processed: false
        });
        await this.outboxRepo.save(event);
        console.log(`[EventService] Published event: ${type}`);
    }
}
