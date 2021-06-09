import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { Audit } from '../../models/audit.entity';

@Injectable()
@EntityRepository(Audit)
export class AuditsService {

    constructor(
        @InjectRepository(Audit)
        private readonly auditRepository: Repository<Audit>,
    ) { }

    create(data: any) {
        return this.auditRepository.save(data);
    }
}
