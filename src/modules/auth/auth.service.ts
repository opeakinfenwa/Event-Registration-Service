import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { AuthUtilsService } from '../../common/utils/auth.utils';
import { UserEntity } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authUtilsService: AuthUtilsService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }

    const isPasswordValid = await this.authUtilsService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<UserEntity, 'password'>): Promise<{
    token: string;
    user: Omit<UserEntity, 'password'>;
  }> {
    const token = this.authUtilsService.generateAuthToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return { token, user };
  }

  async handleGoogleLogin(
    googleId: string,
    email: string,
    name: string,
    role: string,
    authProvider: string,
  ) {
    let user = await this.userRepository.getUserByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.createGoogleUser(
        googleId,
        email,
        name,
        role,
        authProvider,
      );
    }

    const token = this.authUtilsService.generateAuthToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });
    return { user, token };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<any> {
    const { email, newPassword, securityAnswer } = dto;

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAnswerCorrect = await this.authUtilsService.compareSecurityAnswer(
      securityAnswer,
      user.security_answer,
    );

    if (!isAnswerCorrect) {
      throw new UnauthorizedException('Incorrect security answer');
    }

    const hashedPassword =
      await this.authUtilsService.hashPassword(newPassword);
    return this.userRepository.updateUserPassword(user.id, hashedPassword);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<any> {
    const { currentPassword, newPassword } = dto;

    const user = await this.userRepository.getUserById(userId);
    if (!user || !user.password) {
      throw new NotFoundException('User not found or has no password');
    }

    const isValid = await this.authUtilsService.comparePassword(
      currentPassword,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword =
      await this.authUtilsService.hashPassword(newPassword);
    return this.userRepository.updateUserPassword(userId, hashedPassword);
  }
}