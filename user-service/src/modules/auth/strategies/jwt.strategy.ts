import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Use lowercase 'configService' for the variable name
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Recommended to keep this false
      secretOrKey:
        configService.get<string>('SECRET_KEY') || 'default_secret_key',
    });
  }

  async validate(payload: any) {
    // payload contains the decrypted JWT (e.g., sub, email, role, fullName)
    return payload;
  }
}
