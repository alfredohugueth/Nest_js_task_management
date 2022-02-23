import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import * as bycrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  /**
   * Create a user in the database
   * @param authCredentialsDto userName and password
   * @returns string msg if everything works fine
   */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  /**
   * Login a user based if the username and password matche with the ones in the db
   * @param authCredentialsDto userName and password
   * @returns Error if not matches, a message of correct login if matches
   */
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    // Extract the data from the request object
    const { userName, password } = authCredentialsDto;

    // Find if there is an user with that userName
    const user = await this.userRepository.findOne({ userName });

    /* Verify that the user exist and the password in the db match with the
       One that was enter */
    if (user && (await bycrypt.compare(password, user.password))) {
      const payload: JwtPayload = { userName };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException(
      'User or password incorrect, check your login credentials',
    );
  }
}
