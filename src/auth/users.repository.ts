/* eslint-disable prettier/prettier */
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bycrypt from "bcrypt";

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

    // Hash the password to be stored in the db
    const salt = await bycrypt.genSalt()
    const hashedPassword = await bycrypt.hash(password, salt)

    // Create the user Instance
    const user = this.create({ userName, password: hashedPassword });

    // Save it in the database
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505')  // Duplicate username
        throw new ConflictException(`Username ${userName} already exists`)
      
      // Control any other type of error  
      throw new InternalServerErrorException(`Error creating the User, : ${error}`)
    }

    return 'User Register';
  }
}
