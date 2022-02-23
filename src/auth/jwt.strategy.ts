/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * Method to validate user correct authentication
   * @param payload : Object of the Jwt, that contains the userName 
   * @returns The user if is found, or an Unauthorized expection if not
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { userName } = payload;
    // Validate that the user exist in the database, if not, throw an error of unauthorized
    const user: User = await this.userRepository.findOne({ userName });
    if (!user) throw new UnauthorizedException();

    return user
  }
}
