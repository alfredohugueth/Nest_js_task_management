/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * Method to create user in the database
   * @param authCredentialsDto , userName and Password
   * @returns A message of User register if everything is ok, error msg if something goes wrong
   */
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    // Extract the data form the body request
    const { userName, password } = authCredentialsDto;

    // Create the user Instance
    const user = this.create({ userName, password });

    // Save it in the database
    await this.save(user);

    return 'User Register';
  }
}
