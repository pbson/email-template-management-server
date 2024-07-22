import { ApiResult } from '@modules/common/classes/api-result';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MicrosoftSigninDTO } from './dtos/microsoft-signin.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { SigninDTO } from './dtos/signin.dto';
import { SignupDTO } from './dtos/signup.dto';
import { UserService } from './services/users.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Signup user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns JWT token for the newly created user',
  })
  async signup(@Body() signupDTO: SignupDTO) {
    return new ApiResult().success(await this.userService.signup(signupDTO));
  }

  @Post('signin')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Signin user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns JWT token for the signed in user',
  })
  async signin(@Body() signinDTO: SigninDTO) {
    return new ApiResult().success(await this.userService.signin(signinDTO));
  }

  @Post('signin/microsoft')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Signin user with Microsoft' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns JWT token for the signed in user',
  })
  async microsoftSignin(@Body() microsoftSigninDTO: MicrosoftSigninDTO) {
    return new ApiResult().success(
      await this.userService.microsoftSignin(microsoftSigninDTO),
    );
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    await this.userService.resetPassword(resetPasswordDTO);
    return new ApiResult().success(true);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns list of users',
  })
  async getUsers(@Query('role') role: string) {
    const users = await this.userService.getUsersByRole(role);
    return new ApiResult().success(users);
  }
}
