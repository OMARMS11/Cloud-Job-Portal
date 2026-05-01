import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
  // The number of salt rounds determines the computational cost.
  // 10-12 is a good default for most applications.
  private readonly saltRounds = 10;

  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt(this.saltRounds);
    return hash(data, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
