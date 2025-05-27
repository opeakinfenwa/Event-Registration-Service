import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUtilsService } from '../../common/utils/auth.utils';
import { CreateUserDto } from './dtos/createuser.dtos';
import { UserRepository } from './user.repository';
import { SECURITY_QUESTIONS } from 'src/common/utils/securityQuestions';
import { UpdateUserDto } from './dtos/updateUser.dtos';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authUtilsService: AuthUtilsService,
  ) {}

  async signupUser(createUserDto: CreateUserDto) {
    const {
      email,
      name,
      password,
      role,
      authProvider,
      securityQuestion,
      securityAnswer,
    } = createUserDto;

    const googleUser = await this.userRepository.googleUserCheck(email);
    if (googleUser) {
      throw new Error('This email is already registered with Google login');
    }

    const existingUser = await this.userRepository.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
      throw new Error('Invalid security question');
    }

    const hashedPassword = await this.authUtilsService.hashPassword(password);
    const hashedAnswer =
      await this.authUtilsService.hashSecurityAnswer(securityAnswer);
    const newUser = await this.userRepository.createUser(
      email,
      name,
      hashedPassword,
      role,
      authProvider,
      securityQuestion,
      hashedAnswer,
    );

    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.updateUserDetails(
      id,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userRepository.deleteUserById(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return deletedUser;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}