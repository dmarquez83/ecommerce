import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from '../../models';
import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Audit]),
  ],
  controllers: [AuditsController],
  providers: [AuditsService],
  exports: [],
})
export class AuditsModule {}
