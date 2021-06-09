import { HttpModule, Module } from '@nestjs/common';

import { FireBase } from './core/firebase';
import { MessagesService } from './messages.service';

@Module({
    imports: [HttpModule],
    providers: [
        FireBase,
        MessagesService,
    ],
    exports: [MessagesService],
})
export class MessagesModule {}
