import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}
  /**
   * Create a user in the database
   * @param authCredentialsDto userName and password
   * @returns string msg if everything works fine
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.userRepository.createUser(authCredentialsDto);
  }
}
