import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../../common/guards/localAuth.guards';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/auth.guards';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { AuthRequest } from 'src/common/interfaces/authRequest.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response() res) {
    const { token, user } = await this.authService.login(req.user);

    res
      .setHeader('Authorization', `Bearer ${token}`)
      .cookie('token', token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        secure: this.configService.get('NODE_ENV') === 'production',
        httpOnly: true,
        sameSite: true,
      })
      .json({
        message: 'User successfully logged in',
        data: user,
        token,
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Response() res) {
    res
      .clearCookie('token', {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: true,
      })
      .setHeader('Authorization', '')
      .json({
        message: 'User successfully logged out',
      });
  }

  @Get()
  getEntry(@Response() res) {
    return res.send(`<a href="/auth/google"> Authenticate with Google</a>`);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req, @Response() res) {
    const { token, user } = req.user;

    if (!token || !user) {
      return res.redirect('/auth/failure');
    }

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: true,
      })
      .redirect(`/auth/dashboard?token=${token}`);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async dashboard(@Request() req) {
    return {
      message: 'Welcome to your dashboard!',
      user: req.user,
    };
  }

  @Get('failure')
  async failure() {
    return {
      message: 'Authentication failed. Please try again.',
    };
  }

  @Patch('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const user = await this.authService.resetPassword(dto);
    return {
      message: 'Password reset successful',
      data: user,
    };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req: AuthRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = await this.authService.changePassword(req.user.id, dto);
    return {
      message: 'Password changed successfully',
      data: user,
    };
  }
}