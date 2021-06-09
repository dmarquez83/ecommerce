import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';
import FacebookTokenStrategy = require('passport-facebook-token');

@Injectable()
export class FacebookStrategy {

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.init();
    }

    init() {
        use(new FacebookTokenStrategy({
            clientID: this.configService.get('PYNPON_FB_CLIENTID'),
            clientSecret: this.configService.get('PYNPON_FB_CLIENT_SECRET'),
            profileFields: ['email', 'first_name', 'last_name'],
            enableProof: true,
        },
            (accessToken, refreshToken, profile, cb) => { cb(null, profile); }
        ));
    }
}
