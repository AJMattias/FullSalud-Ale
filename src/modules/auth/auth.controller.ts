/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from '../../domain/dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles } from './guards/auth.guard';
import { AuthGuard as GAuthGuard } from '@nestjs/passport';
import { Role } from '../../domain/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, Token } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/login')
  // async loginUser(@Body() loginDto: AuthUserDto): Promise<UserDto & { accessToken: string/*; refreshToken: string*/ }> {
  //   return await this.authService.loginUser(loginDto);
  // }
  @Post('/login')
  async loginUser(@Body() loginDto: AuthUserDto)/*: Promise<UserDto & { accessToken: string; refreshToken: string }>*/ {
    return await this.authService.loginUser(loginDto);
  }

  @Get('google/signin')
  @UseGuards(GAuthGuard('google'))
  async googleSignIn(@Req() req) {

  }

  @Get('google/signin/callback')
  @UseGuards(GAuthGuard('google'))
  async googleSignInCallback(@Req() req) {
    return this.authService.googleSignIn(req);
  }

  @UseGuards( AuthGuard )
  @Post('verify')
  @ApiBearerAuth('bearerAuth')
  verifyToken( @User() user: CurrentUser, @Token() token: string) {
    return this.authService.generateRefreshToken(token);
  }
  
  @Post('/create')
  @Roles(Role.ADMIN)
  async createAdmin(@Body() createUserDto: AuthUserDto) {
    return this.authService.createAdmin(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.authService.uploadImage(file);
    return { url };
  }

}