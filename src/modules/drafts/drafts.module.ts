import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Draft } from '../../models';
import { DraftsController } from './drafts.controller';
import { DraftsService } from './drafts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Draft])],
  providers: [DraftsService],
  controllers: [DraftsController],
  exports: [DraftsService]
})
export class DraftsModule {}
